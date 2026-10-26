import Link from "@/app/_components/NativeLink";

const requirements = [
  { level: 1, title: "First contribution", description: "Have one scientific contribution published.", review: "Awarded automatically after publication" },
  { level: 2, title: "Continued contribution", description: "Have three contributions published across at least two records.", review: "Awarded automatically after publication" },
  { level: 3, title: "Breadth of contribution", description: "Have five contributions published across at least two types: author context, research submissions, or proposals.", review: "Awarded automatically after publication" },
  { level: 4, title: "Connect disciplines", description: "With three stars, receive moderator recognition for a cross-disciplinary connection anchored in microbiome or metallomics research.", review: "Requires moderator review" },
  { level: 5, title: "Topic Steward", description: "With four stars, receive Topic Steward recognition for sustained quality and conduct.", review: "Requires human review" },
];

export function ContributionRecognition({ recognition }: { recognition: { id: string; level: number; reason: string; sourceType?: string; sourceId?: string; policyVersion?: string }[] }) {
  const awarded = new Set(recognition.map((event) => event.level));
  const highest = Math.max(0, ...awarded);
  return <section className="contribution-recognition" aria-labelledby="contribution-recognition-title">
    <header><div><span className="organization-eyebrow">Contribution awards</span><h2 id="contribution-recognition-title">Contributions to WikiBiome</h2><p>Earn recognition through published author context, research submissions, and article improvements.</p></div>{highest > 0 && <span className="recognition-current"><span aria-hidden="true">{"★".repeat(highest)}</span><span>{highest}-star recognition</span></span>}</header>
    <ol className="recognition-requirements" aria-label="Requirements for each award">{requirements.map((award) => <li key={award.level} className={awarded.has(award.level) ? "is-awarded" : ""}>
      <div className="recognition-step"><span aria-label={`${award.level} ${award.level === 1 ? "star" : "stars"}`}>{award.level}<span aria-hidden="true"> ★</span></span>{awarded.has(award.level) && <small>Earned</small>}</div>
      <h3>{award.title}</h3><p>{award.description}</p><small className="recognition-review">{award.review}</small>
    </li>)}</ol>
    <footer><div><strong>{highest ? "Keep contributing" : "Start with one published contribution"}</strong><p>ORCID imports, authorship verification, and Keystone works are counted separately. Pending or rejected contributions do not earn awards.</p></div><nav aria-label="Ways to contribute"><Link href="/submit-work">Submit research</Link><Link href="/propose">Propose an improvement</Link></nav></footer>
    <div className="recognition-support">{recognition.length > 0 && <details><summary>Award history</summary><ul>{recognition.map((event) => <li key={event.id}><b>{event.level} {event.level === 1 ? "star" : "stars"}</b><span>{event.reason}{event.policyVersion === "legacy_acceptance" && event.level <= 3 && <small> · Historical acceptance policy</small>}{event.sourceType === "paper_publication" && <Link href={`/source/${event.sourceId}`}>View published paper &amp; article connections</Link>}</span></li>)}</ul></details>}<Link href="/terms#recognition">Full criteria &amp; appeals</Link></div>
  </section>;
}
