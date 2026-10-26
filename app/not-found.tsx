import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";

export default function NotFound() {
  return <><WikiHeader /><main className="not-found"><span>404</span><h1>This record is not in the public index.</h1><p>It may be a private source, a draft, or an older WikiBiome link.</p><div><Link href="/search">Search the encyclopedia</Link><Link href="/">Return to Gut Microbiome</Link></div></main></>;
}
