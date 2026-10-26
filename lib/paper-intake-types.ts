export type PaperClaim = {
  id: string;
  statement: string;
  page: number;
  passage: string;
  evidenceType: string;
  support: "paper" | "secondary_citation";
  references: number[];
  population: string;
  compartment: string;
  outcome: string;
  limitations: string;
};
export type PaperChange = {
  targetId: string;
  title: string;
  section: string;
  kind: string;
  proposedText: string;
  rationale: string;
  claimIds: string[];
  baseHash: string;
  currentText: string;
};
export type PaperPacket = {
  metadata: {
    title: string;
    authors: string[];
    authorOrcids: string[];
    year: number;
    doi: string;
    publicationStatus: string;
    license: string;
    sourceId: string;
    affiliations: string[];
    abstract: string;
  };
  claims: PaperClaim[];
  changes: PaperChange[];
  references: {
    number: number;
    text: string;
    doi: string;
    matchedSourceId: string | null;
    status: string;
  }[];
  flags: {
    id: string;
    message: string;
    blocking: boolean;
    resolved?: boolean;
    resolution?: string;
  }[];
  provenance: {
    mode: string;
    documentHash: string;
    pageCount: number;
    scanStatus: string;
    model?: string;
    parserVersion?: string;
    knownAuthors?: string[];
    knownAuthorOrcids?: string[];
  };
  metadataConfirmed?: boolean;
  review?: {
    recommendation: string;
    note: string;
    disclosure: string;
    revision: number;
  };
  approval?: { note: string; disclosure: string; revision: number };
  processingError?: string;
};
export type PaperRow = {
  id: string;
  account_id: string;
  identity_key: string;
  title: string;
  topic: string;
  status: string;
  packet_json: string;
  file_key: string | null;
  file_hash: string | null;
  revision: number;
  reviewer_account_id: string | null;
  editor_account_id: string | null;
  created_at: string;
  updated_at: string;
};
export type Paper = {
  id: string;
  accountId: string;
  title: string;
  topic: string;
  status: string;
  packet: PaperPacket;
  fileKey: string | null;
  fileHash: string | null;
  revision: number;
  reviewerAccountId: string | null;
  editorAccountId: string | null;
  createdAt: string;
  updatedAt: string;
};
