import Link from "@/app/_components/NativeLink";

export function OrganizationSearch({ query = "", compact = false }: { query?: string; compact?: boolean }) {
  return <form action="/institutions" method="get" role="search" aria-label="Search organizations and projects" className={`organization-search${compact ? " compact" : ""}`}>
    <label htmlFor="organization-search">Search organizations &amp; projects</label>
    <div><input id="organization-search" name="q" type="search" defaultValue={query} placeholder={compact ? "Organization or researcher" : "Organization, researcher, website, or topic"} maxLength={200}/><button type="submit">Search</button>{query && <Link href="/institutions">Clear</Link>}</div>
  </form>;
}
