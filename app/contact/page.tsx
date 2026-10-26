import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { publicPageMetadata } from "@/lib/search-discovery";

export const metadata: Metadata = publicPageMetadata({
  title: "Contact — WikiBiome",
  description: "Contact WikiBiome about corrections, cited research, privacy, partnerships, or media inquiries.",
  path: "/contact",
});

const contactPaths = [
  { label: "Scientific correction", title: "Improve a specific article", body: "Use the moderated contribution flow so the passage, rationale, and supporting DOI remain attached to the proposal.", href: "/contribute", action: "Suggest an edit" },
  { label: "General and partnership inquiries", title: "Talk with the WikiBiome team", body: "For partnerships, media, cited-author questions, accessibility, or project correspondence, email the project directly.", href: "mailto:hello@wikibiome.com", action: "hello@wikibiome.com" },
  { label: "Privacy request", title: "Request access, correction, or deletion", body: "Send privacy-related requests from the email address associated with the relevant contribution account when possible.", href: "mailto:privacy@wikibiome.com", action: "privacy@wikibiome.com" },
];

export default function ContactPage() {
  return (
    <><WikiHeader /><main className="project-page contact-page"><header className="project-page-hero"><span>Project correspondence</span><h1>Contact WikiBiome</h1><p>Choose the path that keeps your message attached to the right evidence or operational record.</p></header><section className="contact-paths" aria-label="Contact options">{contactPaths.map((item, index) => <article key={item.label}><span>{String(index + 1).padStart(2, "0")} · {item.label}</span><h2>{item.title}</h2><p>{item.body}</p>{item.href.startsWith("/") ? <Link href={item.href}>{item.action} →</Link> : <a href={item.href}>{item.action} →</a>}</article>)}</section><aside className="contact-note"><strong>WikiBiome does not provide individual medical advice.</strong><p>Questions about symptoms, diagnosis, treatment, supplements, or medication should be directed to a qualified healthcare professional.</p><Link href="/about">About the project →</Link></aside></main></>
  );
}
