import revisions from "@/data/revisions.generated.json";
import { normalizeWikiId, type WikiPage } from "@/lib/wikibiome";
import { removePlaceholderText } from "@/lib/article-quality.mjs";

export type RevisionEntry = {
  materialChange: boolean;
  summary: string;
  description: string;
  hash: string;
  date: string;
  author: string;
  subject: string;
  path: string;
  additions: number;
  deletions: number;
};

type RevisionRecord = { paths: string[]; revisions: RevisionEntry[] };
type RevisionData = {
  generatedAt: string;
  repository: string;
  sourceCommit: string;
  records: number;
  revisions: number;
  histories: Record<string, RevisionRecord>;
};

const data = revisions as RevisionData;

export function getRevisionHistory(page: WikiPage) {
  const generatedFrom = typeof page.frontmatter?.generated_from === "string" ? page.frontmatter.generated_from : undefined;
  const sourceId = normalizeWikiId(generatedFrom ?? page.id);
  return {
    sourceId,
    repository: data.repository,
    sourceCommit: data.sourceCommit,
    generatedAt: data.generatedAt,
    paths: data.histories[sourceId]?.paths ?? [],
    revisions: (generatedFrom ? [] : data.histories[sourceId]?.revisions ?? [])
      .filter(revision => revision.materialChange === true && Boolean(revision.summary))
      .map(revision => /to be populated|needs to be populated|no triangles populated yet|sources discussing this intervention need to be reviewed/i.test(`${revision.summary} ${revision.description}`)
        ? { ...revision, summary: removePlaceholderText(revision.summary), description: removePlaceholderText(revision.description) }
        : revision),
  };
}

export const revisionStats = { records: data.records, revisions: data.revisions, sourceCommit: data.sourceCommit };
