import { bodyWordCount, PLACEHOLDER_PATTERN } from "./article-quality.mjs";

export function renderedArticleQuality(html, row) {
  const stack = [];
  const body = [];
  const visible = [];
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  for (const token of markup.matchAll(/<[^>]+>|[^<]+/g)) {
    const value = token[0];
    if (value.startsWith("</")) {
      const tag = value.match(/^<\/([^\s>]+)/)?.[1];
      const index = stack.findLastIndex((item) => item.tag === tag);
      if (index >= 0) stack.length = index;
    } else if (value.startsWith("<")) {
      const tag = value.match(/^<([^\s/>]+)/)?.[1];
      if (!tag || value.startsWith("<!")) continue;
      const parent = stack.at(-1);
      const classes = value.match(/\bclass="([^"]*)"/)?.[1].split(/\s+/) ?? [];
      const capture = parent?.capture || classes.includes("lead-copy") || classes.includes("wiki-section");
      const skip = parent?.skip || /^(?:nav|h[1-6]|sup)$/.test(tag) || classes.includes("citation-preview");
      if (!voidTags.has(tag)) stack.push({ tag, capture, skip });
    } else if (!stack.at(-1)?.skip) {
      const text = value.replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number))).replace(/&(?:nbsp|amp|lt|gt|quot|apos);/g, " ");
      visible.push(text);
      if (stack.at(-1)?.capture) body.push(text);
    }
  }
  const bodyWords = bodyWordCount(body.join(" "));
  const references = new Set([...html.matchAll(/\bid="reference-(\d+)"/g)].map((match) => Number(match[1])));
  const presentReferences = row.realReferenceNumbers.filter((number) => references.has(number)).length;
  const reasons = [...row.reasons];
  if (bodyWords < 400) reasons.push(`rendered body has ${bodyWords} words`);
  if (presentReferences < 3) reasons.push("rendered real references missing");
  if (PLACEHOLDER_PATTERN.test(body.join(" "))) reasons.push("rendered placeholder");
  if (/evidence[\s-]limited/i.test(visible.join(" "))) reasons.push("rendered Evidence-limited notice");
  if (!/<meta name="robots" content="index, follow"/.test(html)) reasons.push("sitemap page is noindex");
  return { bodyWords, presentReferences, reasons };
}
