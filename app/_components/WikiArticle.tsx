import type { ReactNode } from "react";
import Link from "@/app/_components/NativeLink";
import { ArticleMediaFigure } from "@/app/_components/ArticleMediaFigure";
import { ArticleUtilityPanel } from "@/app/_components/ArticleUtilityPanel";
import { ResearchDiscussion } from "@/app/_components/ResearchDiscussion";
import { ResearcherAccountControl } from "@/app/_components/ResearcherAccountControl";
import { PageActivityTrail, PageCollaborationBar } from "@/app/_components/PageCollaboration";
import { getArticleMedia } from "@/lib/article-media";
import { contentSchemaFor, prepareArticleSections } from "@/lib/content-model";
import { getRevisionHistory } from "@/lib/revisions";
import {
  categories,
  canonicalArticleId,
  categoryLabel,
  formatDate,
  generateArticleEvidence,
  getBacklinkPages,
  getCanonicalParadox,
  getCategoryCount,
  getMentionedPages,
  getParadoxLinksForPage,
  getSource,
  getWikiPage,
  normalizeDoi,
  normalizeWikiId,
  relationshipExplanation,
  resolveRelated,
  wikiStats,
  type ArticleEvidence,
  type WikiPage,
} from "@/lib/wikibiome";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const metalNames: Record<string, string> = {
  Ag: "silver",
  Al: "aluminum",
  As: "arsenic",
  Ba: "barium",
  Be: "beryllium",
  Ca: "calcium",
  Cd: "cadmium",
  Co: "cobalt",
  Cr: "chromium",
  Cu: "copper",
  Fe: "iron",
  Hg: "mercury",
  Li: "lithium",
  Mg: "magnesium",
  Mn: "manganese",
  Mo: "molybdenum",
  Ni: "nickel",
  Pb: "lead",
  Sb: "antimony",
  Se: "selenium",
  Sn: "tin",
  Sr: "strontium",
  Ti: "titanium",
  Tl: "thallium",
  V: "vanadium",
  W: "tungsten",
  Zn: "zinc",
};

type MetalNameState = Set<string>;

type InlineStyleToken = {
  raw: string;
  citation: boolean;
};

function namedMetal(symbol: string, charge: string | undefined, seen: MetalNameState) {
  const name = metalNames[symbol];
  const romanCharge = charge === "2" ? "II" : charge === "3" ? "III" : charge;
  const chemical = charge ? `${symbol}${charge}+` : symbol;
  const publicName = charge ? `${name}(${romanCharge})` : name;
  if (seen.has(symbol)) return publicName;
  seen.add(symbol);
  return `${publicName} (${chemical})`;
}

/**
 * Public article copy follows an encyclopedia rule: introduce a metal by its
 * full name and symbol on first use in a section, then prefer its full name.
 * Formula-like names keep their recognized scientific abbreviation.
 */
export function expandMetalNames(text: string, seen: MetalNameState = new Set()) {
  const cuZnSodToken = "\u0000CU_ZN_SOD\u0000";
  const methylmercuryToken = "\u0000METHYLMERCURY\u0000";
  let expanded = text.replace(/\bCu\/Zn-SOD\b/g, () => {
    seen.add("Cu");
    seen.add("Zn");
    return cuZnSodToken;
  });
  expanded = expanded.replace(/\bMeHg\b/g, () => {
    const firstUse = !seen.has("Hg");
    seen.add("Hg");
    return firstUse ? methylmercuryToken : "methylmercury";
  });

  expanded = expanded.replace(/\b(Ag|Al|Ba|Be|Ca|Cd|Co|Cr|Cu|Fe|Hg|Li|Mg|Mn|Mo|Ni|Pb|Sb|Se|Sn|Sr|Ti|Tl|V|W|Zn)([1-4])\+(?=$|[\s,.;:)/\]])/g, (_match, symbol: string, charge: string) => namedMetal(symbol, charge, seen));
  expanded = expanded.replace(/\b(Ag|Al|Ba|Be|Ca|Cd|Co|Cr|Cu|Fe|Hg|Li|Mg|Mn|Mo|Ni|Pb|Sb|Se|Sn|Sr|Ti|Tl|V|W|Zn)\b/g, (_match, symbol: string) => namedMetal(symbol, undefined, seen));

  // Arsenic's symbol is also the English word "As", so expand it only in
  // chemical lists or where the following language clearly describes a metal.
  expanded = expanded.replace(/\bAs\b(?=(?:\s+(?:exposure|levels?|toxicity|contamination|accumulat\w*|deplet\w*|increase\w*|decrease\w*|induc\w*|caus\w*|disrupt\w*|impair\w*|bind\w*|promot\w*|is\b|was\b|has\b|can\b|may\b))|\s+in\s+(?:water|soil|blood|serum|plasma|urine|hair|tissue|food|rice)\b|[,;)/])/g, () => namedMetal("As", undefined, seen));
  return expanded
    .replaceAll(cuZnSodToken, "copper/zinc superoxide dismutase (Cu/Zn-SOD)")
    .replaceAll(methylmercuryToken, "methylmercury (MeHg)");
}

/**
 * Apply WikiBiome's Wikipedia-aligned inline house style at render time while
 * leaving the synchronized source corpus untouched:
 *
 * - punctuation precedes citation markers;
 * - adjacent citation markers have no comma or space between them;
 * - typewriter double hyphens become unspaced em dashes.
 */
export function normalizeEncyclopedicDashes(text: string) {
  return text
    .replace(/^[ \t]*--[ \t]*$/gm, "—")
    .replace(/^--[ \t]+/gm, "")
    .replace(/[ \t]+--[ \t]+/g, "—")
    .replace(/[ \t]*—[ \t]*/g, "—");
}

export function normalizeEncyclopedicInlineStyle(text: string, citationNumbers: Record<string, number>) {
  const dashNormalized = normalizeEncyclopedicDashes(text);
  const markup = /\[?\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]\]?/g;
  const tokens: InlineStyleToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markup.exec(dashNormalized)) !== null) {
    if (match.index > lastIndex) tokens.push({ raw: dashNormalized.slice(lastIndex, match.index), citation: false });
    tokens.push({ raw: match[0], citation: Boolean(citationNumbers[normalizeWikiId(match[1])]) });
    lastIndex = markup.lastIndex;
  }
  if (lastIndex < dashNormalized.length) tokens.push({ raw: dashNormalized.slice(lastIndex), citation: false });

  for (let index = 0; index < tokens.length; index += 1) {
    if (!tokens[index].citation) continue;
    const clusterStart = index;
    let clusterEnd = index;

    while (
      clusterEnd + 2 < tokens.length
      && !tokens[clusterEnd + 1].citation
      && /^[\s,]*$/.test(tokens[clusterEnd + 1].raw)
      && tokens[clusterEnd + 2].citation
    ) {
      tokens[clusterEnd + 1].raw = "";
      clusterEnd += 2;
    }

    const afterCluster = tokens[clusterEnd + 1];
    const punctuation = afterCluster && !afterCluster.citation
      ? afterCluster.raw.match(/^([.,;:!?])/)?.[1]
      : undefined;
    if (punctuation) afterCluster.raw = afterCluster.raw.slice(punctuation.length);

    const beforeCluster = tokens[clusterStart - 1];
    if (beforeCluster) {
      beforeCluster.raw = `${beforeCluster.raw.replace(/\s+$/, "")}${punctuation ?? ""}`;
    } else if (punctuation) {
      tokens[clusterStart].raw = `${punctuation}${tokens[clusterStart].raw}`;
    }

    index = clusterEnd;
  }

  return tokens.map((token) => token.raw).join("");
}

function inlineMarkup(text: string, citationNumbers: Record<string, number>, metalState: MetalNameState): ReactNode[] {
  const parts: ReactNode[] = [];
  const format = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[?\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]\]?/g;
  const styledText = normalizeEncyclopedicInlineStyle(text, citationNumbers);
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = format.exec(styledText)) !== null) {
    if (match.index > lastIndex) parts.push(expandMetalNames(styledText.slice(lastIndex, match.index), metalState));
    if (match[1]) {
      parts.push(<strong key={`bold-${match.index}`}>{inlineMarkup(match[1], citationNumbers, metalState)}</strong>);
    } else if (match[2]) {
      parts.push(<em key={`italic-${match.index}`}>{inlineMarkup(match[2], citationNumbers, metalState)}</em>);
    } else if (match[3]) {
      parts.push(<code key={`code-${match.index}`}>{match[3]}</code>);
    } else if (match[4]) {
      const id = normalizeWikiId(match[4]);
      const page = getWikiPage(id);
      const citationNumber = citationNumbers[id];
      const label = match[5]?.trim() || page?.title || match[4].replace(/-/g, " ");
      if (page) {
        parts.push(<Link href={`/article/${canonicalArticleId(id)}`} key={`link-${match.index}`}>{label}</Link>);
      } else if (citationNumber) {
        const source = getSource(id);
        const previewId = `citation-preview-${citationNumber}-${match.index}`;
        parts.push(
          <sup className="article-citation" key={`citation-${match.index}`}>
            <a href={`#reference-${citationNumber}`} aria-label={`Reference ${citationNumber}`} aria-describedby={previewId}>[{citationNumber}]</a>
            <span className="citation-preview" id={previewId} role="tooltip">
              <b>{source?.title ?? label}</b>
              <small>{source ? `${formatAuthors(source.authors)}${source.year ? ` · ${source.year}` : ""}` : "Source metadata pending editorial review"}</small>
              <em>Open reference {citationNumber} ↓</em>
            </span>
          </sup>,
        );
      } else {
        parts.push(<span className="missing-link" key={`missing-${match.index}`}>{label}</span>);
      }
    }
    lastIndex = format.lastIndex;
  }

  if (lastIndex < styledText.length) parts.push(expandMetalNames(styledText.slice(lastIndex), metalState));
  return parts;
}

type RichBlock =
  | { type: "table"; source: string; key: string }
  | { type: "paragraph"; source: string; key: string; continuous: boolean };

const proseSentenceSegmenter = new Intl.Segmenter("en", { granularity: "sentence" });
const PROSE_MAX_WORDS = 50;
const PROSE_MAX_SENTENCES = 3;

function proseWordCount(source: string) {
  return source
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, id: string, label: string) => label || id.replace(/-/g, " "))
    .replace(/[*_`]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function proseChunks(source: string) {
  const sentences = [...proseSentenceSegmenter.segment(source)]
    .map(({ segment }) => segment.trim())
    .filter(Boolean);
  if (sentences.length < 2) return [source];

  const chunks: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (const sentence of sentences) {
    const sentenceWords = proseWordCount(sentence);
    const shouldBreak = current.length > 0
      && (current.length >= PROSE_MAX_SENTENCES || currentWords + sentenceWords > PROSE_MAX_WORDS);
    if (shouldBreak) {
      chunks.push(current.join(" "));
      current = [];
      currentWords = 0;
    }
    current.push(sentence);
    currentWords += sentenceWords;
  }

  if (current.length) chunks.push(current.join(" "));
  return chunks;
}

function proseListChunks(source: string) {
  const items = source
    .split("\n")
    .map((line) => line.trim().replace(/^(?:[-*]\s+|\d+[.)]\s*)/, ""))
    .filter(Boolean)
    .map((item) => /[.!?]["')\]]*$/.test(item) ? item : `${item.replace(/[;:]\s*$/, "")}.`);
  const chunks: string[] = [];
  let shortItems: string[] = [];
  let shortItemWords = 0;

  const flushShortItems = () => {
    if (shortItems.length) chunks.push(shortItems.join(" "));
    shortItems = [];
    shortItemWords = 0;
  };

  for (const item of items) {
    const itemWords = proseWordCount(item);
    if (itemWords >= 24) {
      flushShortItems();
      chunks.push(...proseChunks(item));
      continue;
    }
    if (shortItems.length >= PROSE_MAX_SENTENCES || shortItemWords + itemWords > PROSE_MAX_WORDS) flushShortItems();
    shortItems.push(item);
    shortItemWords += itemWords;
  }
  flushShortItems();
  return chunks;
}

function pushProseChunks(blocks: RichBlock[], source: string, key: string | number, continuous: boolean) {
  proseChunks(source).forEach((chunk, chunkIndex) => {
    blocks.push({ type: "paragraph", source: chunk, key: `${key}-${chunkIndex}`, continuous });
  });
}

function isListBlock(source: string) {
  const lines = source.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.length > 0 && lines.every((line) => line.startsWith("- ") || /^\d+[.)]\s/.test(line));
}

function introductoryListChunks(source: string) {
  const lines = source.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || isListBlock(lines[0]) || !isListBlock(lines.slice(1).join("\n"))) return null;

  const introduction = lines[0].replace(/[:;]\s*$/, ".");
  const paragraphs = proseListChunks(lines.slice(1).join("\n"));
  if (paragraphs.length && proseWordCount(`${introduction} ${paragraphs[0]}`) <= PROSE_MAX_WORDS) {
    paragraphs[0] = `${introduction} ${paragraphs[0]}`;
  } else {
    paragraphs.unshift(introduction);
  }
  return paragraphs;
}

function proseBlocks(text: string): RichBlock[] {
  const sourceBlocks = text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  const blocks: RichBlock[] = [];

  sourceBlocks.forEach((source, key) => {
    const lines = source.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.every((line) => line.startsWith("|"))) {
      blocks.push({ type: "table", source, key: `${key}-table` });
      return;
    }

    const introductoryParagraphs = introductoryListChunks(source);
    if (introductoryParagraphs) {
      introductoryParagraphs.forEach((paragraph, paragraphIndex) => pushProseChunks(blocks, paragraph, `${key}-${paragraphIndex}`, true));
      return;
    }

    if (isListBlock(source)) {
      const paragraphs = proseListChunks(source);
      const previous = blocks.at(-1);
      if (previous?.type === "paragraph" && /[:;]\s*$/.test(previous.source)) {
        blocks.pop();
        const introduction = previous.source.replace(/[:;]\s*$/, ".");
        if (paragraphs.length && proseWordCount(`${introduction} ${paragraphs[0]}`) <= PROSE_MAX_WORDS) {
          paragraphs[0] = `${introduction} ${paragraphs[0]}`;
        } else {
          paragraphs.unshift(introduction);
        }
      }
      paragraphs.forEach((paragraph, paragraphIndex) => pushProseChunks(blocks, paragraph, `${key}-${paragraphIndex}`, true));
      return;
    }

    const paragraph = source.split("\n").map((line) => line.trim()).filter(Boolean).join(" ");
    pushProseChunks(blocks, paragraph, key, true);
  });

  return blocks;
}

export function RichText({ text, citationNumbers, prose = false }: { text: string; citationNumbers: Record<string, number>; prose?: boolean }) {
  const metalState: MetalNameState = new Set();
  const cleanedText = text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\s*---+\s*$/gm, "")
    .trim();
  const blocks: RichBlock[] = prose
    ? proseBlocks(cleanedText)
    : cleanedText.split(/\n\s*\n/).flatMap((source, key) => {
      const trimmed = source.trim();
      if (!trimmed) return [];
      const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
      const introductoryParagraphs = introductoryListChunks(trimmed);
      if (introductoryParagraphs) {
        return introductoryParagraphs.flatMap((paragraph, paragraphIndex) => proseChunks(paragraph).map((chunk, chunkIndex) => ({
          type: "paragraph" as const,
          source: chunk,
          key: `${key}-${paragraphIndex}-${chunkIndex}`,
          continuous: false,
        })));
      }
      if (isListBlock(trimmed) || lines.every((line) => line.startsWith("|"))) {
        return [{ type: "paragraph" as const, source: trimmed, key: `${key}-0`, continuous: false }];
      }
      return proseChunks(lines.join(" ")).map((chunk, chunkIndex) => ({
        type: "paragraph" as const,
        source: chunk,
        key: `${key}-${chunkIndex}`,
        continuous: false,
      }));
    });

  return blocks.map((block) => {
    const lines = block.source.split("\n").map((line) => line.trim()).filter(Boolean);

    if (block.type === "table" || (lines.length >= 2 && lines.every((line) => line.startsWith("|")))) {
      const rows = lines
        .filter((line) => !/^\|?\s*[-:]+/.test(line))
        .map((line) => line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
      const [headers, ...body] = rows;
      return (
        <div className="table-wrap" key={block.key}>
          <table>
            <thead><tr>{headers.map((header) => <th key={header}>{inlineMarkup(header, citationNumbers, metalState)}</th>)}</tr></thead>
            <tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inlineMarkup(cell, citationNumbers, metalState)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    }

    if (prose) {
      return <p className={block.continuous ? "continuous-prose" : undefined} key={block.key}>{inlineMarkup(block.source, citationNumbers, metalState)}</p>;
    }

    if (lines.every((line) => line.startsWith("- "))) {
      return <ul key={block.key}>{lines.map((line) => <li key={line}>{inlineMarkup(line.slice(2), citationNumbers, metalState)}</li>)}</ul>;
    }

    if (lines.every((line) => /^\d+[.)]\s/.test(line))) {
      return <ol key={block.key}>{lines.map((line) => <li key={line}>{inlineMarkup(line.replace(/^\d+[.)]\s/, ""), citationNumbers, metalState)}</li>)}</ol>;
    }

    return <p key={block.key}>{inlineMarkup(lines.join(" "), citationNumbers, metalState)}</p>;
  });
}

function parseOpenQuestions(body: string) {
  return body
    .split(/\n+/)
    .map((line) => line.trim().replace(/^(?:[-*]\s+|\d+[.)]\s*)/, ""))
    .filter(Boolean)
    .map((line) => {
      const questionEnd = line.indexOf("?");
      return questionEnd >= 0
        ? { question: line.slice(0, questionEnd + 1), answer: line.slice(questionEnd + 1).trim() }
        : { question: line, answer: "" };
    });
}

export function OpenQuestionsSection({ body, citationNumbers, id = "open-questions" }: { body: string; citationNumbers: Record<string, number>; id?: string }) {
  const questions = parseOpenQuestions(body);
  return (
    <section className="wiki-section level-2 open-questions" id={id}>
      <h2>Open Questions<a href={`#${id}`} aria-label="Link to Open Questions">#</a></h2>
      <p className="open-questions-intro">Unresolved questions identified by the current evidence record.</p>
      <div className="open-question-list">
        {questions.map((item, index) => (
          <details key={`${item.question}-${index}`}>
            <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{inlineMarkup(item.question, citationNumbers, new Set())}</strong><i aria-hidden="true">+</i></summary>
            <div>{item.answer ? <RichText text={item.answer} citationNumbers={citationNumbers} /> : <p>The current WikiBiome record identifies this as an unresolved evidence gap.</p>}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function isDietaryParadoxHeading(heading: string) {
  return /(?:dietary.*paradox|paradox.*dietary)/i.test(heading);
}

function isNumberedParadoxHeading(heading: string) {
  return /^paradox\s+\d+\s*:/i.test(heading);
}

export function ParadoxLinkIndex({ pageId }: { pageId: string }) {
  const links = getParadoxLinksForPage(pageId);
  if (!links.length) return null;
  return (
    <div className="paradox-link-panel">
      <p>Full evidence is maintained on the canonical paradox {links.length === 1 ? "article" : "articles"}.</p>
      <div>
        {links.map((link, index) => (
          <Link href={`/article/${link.id}`} key={link.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{link.title}</strong><small>{link.summary}</small></div>
            <em>Read paradox →</em>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NumberedParadoxSection({ heading: sectionHeading }: { heading: string }) {
  const heading = sectionHeading.match(/^paradox\s+(\d+)\s*:\s*(.*)$/i);
  const number = Number(heading?.[1] ?? 0);
  const paradox = getCanonicalParadox(number);
  if (!paradox) return null;
  const id = slugify(sectionHeading);
  return (
    <section className="paradox-directory-entry" id={id}>
      <Link href={`/article/${paradox.id}`}>
        <span>Paradox {String(number).padStart(2, "0")}</span>
        <h2>{paradox.title}</h2>
        <p>{paradox.summary}</p>
        <em>Open full article →</em>
      </Link>
    </section>
  );
}

function asStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function formatAuthors(authors: string[] = []) {
  if (!authors.length) return "Author information pending";
  return authors.length <= 3 ? authors.join(", ") : `${authors.slice(0, 3).join(", ")} et al.`;
}

export function EvidenceIntegrity({ evidence }: { evidence: ArticleEvidence }) {
  const recovered = evidence.recoveredCitationIds.length;
  return (
    <aside className="evidence-integrity" aria-label="Evidence integrity summary">
      <div>
        <span>Evidence generated from article text</span>
        <strong>{evidence.references.length}</strong>
        <small>unique references</small>
      </div>
      <div>
        <span>Claim provenance map</span>
        <strong>{evidence.claims.length}</strong>
        <small>evidence-bearing passages linked to studies</small>
      </div>
      <div className={recovered ? "reconciled" : "aligned"}>
        <span>Vault reconciliation</span>
        <strong>{recovered ? `+${recovered}` : "✓"}</strong>
        <small>{recovered ? "inline sources recovered beyond frontmatter" : "body and frontmatter aligned"}</small>
      </div>
    </aside>
  );
}

export function ClaimProvenance({ evidence }: { evidence: ArticleEvidence }) {
  if (!evidence.claims.length) return null;
  return (
    <details className="claim-provenance" id="claim-provenance">
      <summary>
        <span>Evidence map</span>
        <strong>{evidence.claims.length} cited passages</strong>
        <em>Inspect provenance +</em>
      </summary>
      <div className="claim-provenance-list">
        {evidence.claims.slice(0, 24).map((claim, index) => (
          <article id={claim.id} key={claim.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><small>{normalizeEncyclopedicDashes(claim.section)}</small><p>{normalizeEncyclopedicDashes(claim.text)}</p></div>
            <footer>{claim.citationNumbers.map((number) => <a href={`#reference-${number}`} aria-label={`Reference ${number}`} key={number}>[{number}]</a>)}</footer>
          </article>
        ))}
        {evidence.claims.length > 24 && <p className="claim-provenance-limit">Showing 24 of {evidence.claims.length} evidence-bearing passages. Every remaining citation is still indexed in the reference record below.</p>}
      </div>
    </details>
  );
}

export function ArticleRevisionNote({ page }: { page: WikiPage }) {
  const history = getRevisionHistory(page);
  const latest = history.revisions[0];
  return (
    <aside className="article-revision-note" aria-label="Article revision summary">
      <div><span>Revision history</span><strong>{history.revisions.length || "Generated"}</strong><small>{history.revisions.length ? "material page changes recorded" : "derived from a canonical source record"}</small></div>
      <p>{latest ? <><b>Latest:</b> {latest.summary}<small>{latest.author} · {formatDate(latest.date)}</small></> : <>This article is generated from <b>{history.sourceId}</b> at the synchronized source snapshot.</>}</p>
      <Link href={`/article/${page.id}/history`}>View history and diffs →</Link>
    </aside>
  );
}

export function ReferencesSection({ evidence }: { evidence: ArticleEvidence }) {
  if (!evidence.references.length) return null;
  return (
    <section className="references-section" id="references" aria-labelledby="references-title">
      <header>
        <div>
          <span>Generated evidence record</span>
          <h2 id="references-title">References <b>{evidence.references.length}</b></h2>
        </div>
        <p>Numbered by first appearance in the article, then reconciled with its declared source list.</p>
      </header>
      <ol className="reference-list">
        {evidence.references.map((reference) => {
          const doi = normalizeDoi(reference.doi);
          return (
            <li id={`reference-${reference.number}`} key={reference.id}>
              <span className="reference-number">{reference.number}</span>
              <div>
                <p>
                  {reference.keystone && <span className="keystone-mark" title="Keystone study">★</span>}
                  <strong>{formatAuthors(reference.authors)}</strong>
                  {reference.year && <> ({reference.year})</>}. <em>{reference.title}</em>
                  {reference.journal && <>. <span>{reference.journal}</span></>}.
                </p>
                <footer>
                  {!reference.missingMetadata && <Link href={`/source/${reference.id}`}>WikiBiome source record <span aria-hidden="true">→</span></Link>}
                  {!reference.missingMetadata && <Link className="reference-claim-link" href={`/source/${reference.id}/claim`}>Are you an author?</Link>}
                  {reference.missingMetadata && <span className="doi-warning">Registry entry pending</span>}
                  {doi.status === "valid" && <a href={doi.href} target="_blank" rel="noreferrer">doi:{doi.bare} <span aria-hidden="true">↗</span></a>}
                  {doi.status === "malformed" && <span className="doi-warning">DOI flagged for audit: {doi.raw}</span>}
                </footer>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ArticleNetwork({ page }: { page: WikiPage }) {
  const mentioned = getMentionedPages(page, 18);
  const backlinks = getBacklinkPages(page, 18);
  const constellation = [...new Map([...mentioned, ...backlinks].map((item) => [item.id, item])).values()].slice(0, 12);
  if (!mentioned.length && !backlinks.length) return null;
  return (
    <section className="article-network" id="connections" aria-labelledby="article-network-title">
      <header>
        <span>Knowledge graph</span>
        <h2 id="article-network-title">Article network</h2>
      </header>
      <div className="relationship-constellation">
        <div className="constellation-core"><small>Current record</small><strong>{page.title}</strong><span>{categoryLabel(page.category)}</span></div>
        <div className="constellation-nodes">{constellation.map((item) => <Link className={`constellation-node node-${item.category}`} href={`/article/${canonicalArticleId(item.id)}`} key={item.id}><small>{categoryLabel(item.category)}</small><strong>{item.title}</strong><span>{relationshipExplanation(page, item)}</span></Link>)}</div>
      </div>
      <div>
        {!!mentioned.length && (
          <section>
            <h3>Mentioned here <b>{mentioned.length}</b></h3>
            <div>{mentioned.map((item) => <Link href={`/article/${item.id}`} key={item.id}>{item.title}</Link>)}</div>
          </section>
        )}
        {!!backlinks.length && (
          <section>
            <h3>Pages linking here <b>{page.backlinks?.length ?? backlinks.length}</b></h3>
            <div>{backlinks.map((item) => <Link href={`/article/${item.id}`} key={item.id}>{item.title}</Link>)}</div>
          </section>
        )}
      </div>
    </section>
  );
}

export function WikiHeader({ query = "" }: { query?: string }) {
  return (
    <header className="wiki-header">
      <Link className="wiki-brand" href="/">
        <img className="wiki-brand-mark" src="/wikibiome-logo.png" alt="" />
        <span><strong>Wiki</strong>Biome<small>The human microbiome encyclopedia</small></span>
      </Link>
      <form className="global-search" action="/search" role="search">
        <label className="sr-only" htmlFor="global-search">Search WikiBiome</label>
        <span aria-hidden="true">⌕</span>
        <input id="global-search" name="q" defaultValue={query} placeholder={`Search ${wikiStats.totalPages} articles`} />
        <button type="submit">Search</button>
      </form>
      <div className="header-actions">
        <nav className="utility-nav" aria-label="Utility navigation">
          <Link href="/explore">Explore</Link>
          <Link href="/category/signature">Signatures</Link>
          <Link href="/researchers">Researchers</Link>
          <Link href="/submit-work">Submit work</Link>
          <Link href="/about">About</Link>
          <Link className="utility-support" href="/support">Collaborate</Link>
        </nav>
        <ResearcherAccountControl />
      </div>
    </header>
  );
}

function WikiRail({ page }: { page: WikiPage }) {
  const contents = (page.sections ?? []).filter((section) => section.level === 2);
  return (
    <aside className="wiki-rail">
      <nav aria-label="Encyclopedia navigation">
        <p className="rail-label">Navigate</p>
        <Link className="rail-home" href="/"><span>⌂</span> Main article</Link>
        <Link href="/search"><span>⌕</span> Search all articles</Link>
        <div className="rail-rule" />
        <p className="rail-label">Knowledge domains</p>
        {categories.map((category) => (
          <Link href={`/category/${category.id}`} key={category.id}>
            <span className={`rail-dot ${category.id}`} />
            {category.label}
            <b>{getCategoryCount(category.id)}</b>
          </Link>
        ))}
      </nav>
      {!!contents.length && (
        <nav className="contents-nav" aria-label="Table of contents">
          <p className="rail-label">On this page</p>
          {contents.slice(0, 9).map((section, index) => (
            <a href={`#${slugify(section.heading)}`} key={section.heading}>
              <i>{String(index + 1).padStart(2, "0")}</i>{normalizeEncyclopedicDashes(section.heading)}
            </a>
          ))}
          <a href="#references"><i>R</i>References</a>
        </nav>
      )}
      <div className="rail-license">Open scientific education<br />from <Link href="/organizations/microbiome-medicine">Microbiome Medicine</Link></div>
    </aside>
  );
}

function ArticleInfobox({ page, referenceCount }: { page: WikiPage; referenceCount: number }) {
  const schema = contentSchemaFor(page);
  const related = resolveRelated(page);
  const media = getArticleMedia(page.id);
  const metalDependencies = asStrings(page.frontmatter?.metal_dependencies);
  const enzymes = asStrings(page.frontmatter?.key_enzymes);
  const subtype = typeof page.frontmatter?.subtype === "string" ? page.frontmatter.subtype : page.type;

  return (
    <aside className="article-aside" aria-label={`${page.title} facts`}>
      <div className="infobox">
        {media ? <ArticleMediaFigure media={media} /> : (
          <div className={`infobox-visual infobox-${page.category}`}>
            <img src="/wikibiome-human-system-v2.png" alt="" />
            <span>{page.title.slice(0, 2)}</span><i /><i /><i />
            <small>{categoryLabel(page.category)} system map</small>
          </div>
        )}
        <div className="infobox-title"><span>WikiBiome record</span><strong>{page.title}</strong></div>
        <dl>
          <div><dt>Domain</dt><dd><Link href={`/category/${page.category}`}>{categoryLabel(page.category)}</Link></dd></div>
          <div><dt>Record type</dt><dd>{schema.label} · {subtype}</dd></div>
          <div><dt>References</dt><dd>{referenceCount} generated records</dd></div>
        </dl>
        {!!metalDependencies.length && <div className="fact-list"><span>Metal dependencies</span>{metalDependencies.slice(0, 6).map((item) => {
          const id = slugify(item);
          return getWikiPage(id) ? <Link href={`/article/${canonicalArticleId(id)}`} key={item}>{item}</Link> : <b key={item}>{item}</b>;
        })}</div>}
        {!!enzymes.length && <div className="fact-list"><span>Key enzymes</span>{enzymes.slice(0, 4).map((item) => <b key={item}>{item}</b>)}</div>}
        {!!page.tags?.length && <div className="tag-list">{page.tags.slice(0, 8).map((tag) => <Link href={`/search?q=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}</div>}
      </div>
      {!!related.length && (
        <div className="related-card">
          <span>Connected records</span>
          {related.map((item) => <Link href={`/article/${item.id}`} key={item.id}><i>{item.title.slice(0, 1)}</i><b>{item.title}</b><em>↗</em></Link>)}
        </div>
      )}
      <div className="corpus-note"><strong>{wikiStats.sources.toLocaleString()}</strong><span>peer-reviewed sources indexed across WikiBiome</span></div>
    </aside>
  );
}

export function EditorialStatusNotice({ status }: { status?: WikiPage["editorialStatus"] }) {
  if (!status) return null;
  return (
    <aside className={`template-notice editorial-status ${status.disposition}`} aria-label="Editorial evidence status">
      <span>{status.publicLabel}</span>
      <p>{status.rationale}</p>
    </aside>
  );
}

export function WikiArticle({ page, home = false }: { page: WikiPage; home?: boolean }) {
  const schema = contentSchemaFor(page);
  const sections = prepareArticleSections(page);
  const contents = sections.filter((section) => section.level === 2);
  const evidence = generateArticleEvidence(page);
  const media = getArticleMedia(page.id);
  const history = getRevisionHistory(page);
  const referenceCount = evidence.references.length;
  const consumedSections = new Set<number>();

  sections.forEach((section, index) => {
    if (!isDietaryParadoxHeading(section.heading) && !isNumberedParadoxHeading(section.heading)) return;
    const end = sections.findIndex((candidate, candidateIndex) => candidateIndex > index && candidate.level <= section.level);
    const boundary = end >= 0 ? end : sections.length;
    const subsections = sections.slice(index + 1, boundary);
    subsections.forEach((_subsection, childIndex) => consumedSections.add(index + childIndex + 1));
  });

  return (
    <>
      <WikiHeader />
      <div className="wiki-shell">
        <WikiRail page={page} />
        <main className={`article-page content-${schema.kind} template-${schema.template}`}>
          <div className="article-breadcrumbs"><Link href="/">WikiBiome</Link><span>/</span><Link href={`/category/${page.category}`}>{categoryLabel(page.category)}</Link><span>/</span><b>{page.title}</b></div>
          {home && <div className="main-page-note"><span>Featured foundation article</span><b>Start here, then follow any blue connection through the encyclopedia.</b></div>}
          <header className="article-header">
            <div className="article-system-art" aria-hidden="true"><img src="/wikibiome-human-system-v2.png" alt="" /><i /><i /><i /></div>
            <div className="article-heading-copy">
              <p>{schema.label} · {referenceCount} generated references</p>
              <h1>{page.title}</h1>
              <span>{schema.description}</span>
            </div>
            <div className="article-tabs">
              <a className="active" href="#article">Article</a>
              <a href="#connections">Connections <b>{page.related?.length ?? 0}</b></a>
              <a href="#references">Evidence <b>{referenceCount}</b></a>
            </div>
            <PageCollaborationBar targetType="article" targetId={page.id} />
          </header>

          <div className="article-grid" id="article">
            <article className="article-body">
              {media && <div className="article-mobile-media"><ArticleMediaFigure media={media} /></div>}
              <EditorialStatusNotice status={page.editorialStatus} />
              {schema.kind === "stop" && <aside className="template-notice caution"><span>Clinical caution record</span><p>This page preserves an evidence-linked caution from the WikiBiome corpus. It is educational context, not individualized medical advice.</p></aside>}
              {schema.kind === "analysis" && <aside className="template-notice synthesis"><span>Cross-record synthesis</span><p>This analysis connects evidence across multiple WikiBiome records; use the inline citations to inspect each underlying source.</p></aside>}
              {schema.kind === "intervention" && <aside className="template-notice intervention"><span>Intervention evidence</span><p>Mechanism, reported outcomes, limitations, and cautions are kept together so an intervention is not separated from its evidence boundaries.</p></aside>}
              {page.overview && <div className="lead-copy"><RichText text={page.overview} citationNumbers={evidence.citationNumbers} /></div>}
              <EvidenceIntegrity evidence={evidence} />
              <ClaimProvenance evidence={evidence} />
              {!!contents.length && (
                <details className="mobile-contents">
                  <summary>Contents</summary>
                  {contents.map((section, index) => <a href={`#${slugify(section.heading)}`} key={section.heading}>{index + 1}. {normalizeEncyclopedicDashes(section.heading)}</a>)}
                </details>
              )}
              {sections.map((section, index) => {
                if (consumedSections.has(index)) return null;
                const id = slugify(section.heading);
                const Heading = section.level === 2 ? "h2" : "h3";
                if (isNumberedParadoxHeading(section.heading)) {
                  return <NumberedParadoxSection heading={section.heading} key={`${section.heading}-${section.level}`} />;
                }
                if (isDietaryParadoxHeading(section.heading)) {
                  const displayHeading = normalizeEncyclopedicDashes(section.heading);
                  return (
                    <section className={`wiki-section level-${section.level} paradox-section`} id={id} key={`${section.heading}-${section.level}`}>
                      <Heading>{displayHeading}<a href={`#${id}`} aria-label={`Link to ${displayHeading}`}>#</a></Heading>
                      <ParadoxLinkIndex pageId={page.id} />
                    </section>
                  );
                }
                if (section.kind === "open_questions") {
                  return <OpenQuestionsSection body={section.body} citationNumbers={evidence.citationNumbers} id={id} key={`${section.heading}-${section.level}`} />;
                }
                const displayHeading = normalizeEncyclopedicDashes(section.heading);
                return (
                  <section className={`wiki-section level-${section.level} section-${section.kind}${section.renderAsProse ? " continuous-prose-section" : ""}`} id={id} key={`${section.heading}-${section.level}`}>
                    <Heading>{displayHeading}<a href={`#${id}`} aria-label={`Link to ${displayHeading}`}>#</a></Heading>
                    {section.body && <RichText text={section.body} citationNumbers={evidence.citationNumbers} prose={section.renderAsProse} />}
                  </section>
                );
              })}
              <ReferencesSection evidence={evidence} />
              <ArticleNetwork page={page} />
              <ResearchDiscussion targetType="article" targetId={page.id} />
              <PageActivityTrail targetType="article" targetId={page.id} revisions={history.revisions} repository={history.repository} />
              <ArticleRevisionNote page={page} />
              <div className="article-end">
                <span>Continue exploring</span>
                <h2>Every article is a doorway.</h2>
                <div>{resolveRelated(page, 6).map((item) => <Link href={`/article/${item.id}`} key={item.id}><small>{categoryLabel(item.category)}</small><b>{item.title}</b><span>Read article →</span></Link>)}</div>
              </div>
              <footer className="article-provenance" id="provenance">
                <p>Generated from the WikiBiome Markdown vault and reconciled against its source registry.</p>
                <span>{referenceCount} references · {page.backlinks?.length ?? 0} backlinks · {page.tags?.length ?? 0} indexed topics</span>
              </footer>
            </article>
            <div className="article-right-column"><ArticleUtilityPanel title={page.title} pageId={page.id} updated={page.updated}/><ArticleInfobox page={page} referenceCount={referenceCount} /></div>
          </div>
        </main>
      </div>
    </>
  );
}
