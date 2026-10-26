import { researcherDisplayName } from "@/lib/orcid-display.mjs";

type Props = { orcid: string; name: string; className?: string };

export function OrcidIcon() {
  return <img className="orcid-id-icon" src="/orcid-id.svg" width={20} height={20} alt="" aria-hidden="true" />;
}

export function OrcidLink({ orcid, name, className = "" }: Props) {
  const id = orcid.replace(/^https?:\/\/(?:www\.)?orcid\.org\//i, "").replace(/\/$/, "");
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(id)) return null;
  const label = `View ${researcherDisplayName(name)}’s ORCID profile`;
  return <a className={`orcid-id-link ${className}`.trim()} href={`https://orcid.org/${id}`} target="_blank" rel="noreferrer" aria-label={label} title={label}><OrcidIcon /></a>;
}
