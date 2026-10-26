import Link from "@/app/_components/NativeLink";
import { organizationProfiles, organizationMonogram } from "@/lib/organization-profiles.mjs";

export function OrganizationDirectory({ profiles = organizationProfiles, title = "Explore organizations & projects" }: { profiles?: typeof organizationProfiles; title?: string }) {
  if (!profiles.length) return null;
  return <section className="organization-directory" aria-label={title}><h2>{title}</h2><div>{profiles.map((profile) => <Link className="organization-card" href={`/organizations/${profile.slug}`} key={profile.slug}><span className={`organization-monogram ${profile.slug}`} aria-hidden="true">{organizationMonogram(profile.slug)}</span><span className="organization-card-content"><span className="organization-eyebrow">{profile.kind}</span><strong>{profile.name}</strong><span className="organization-card-description">{profile.description}</span><span className="organization-card-domain">{new URL(profile.website).hostname}</span></span><span className="organization-card-arrow" aria-hidden="true">→</span></Link>)}</div></section>;
}
