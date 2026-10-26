import { permanentRedirect } from "next/navigation";
import { signatureExplorerDestination } from "@/lib/routing-policy.mjs";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LegacySignaturesPage({ searchParams }: { searchParams: SearchParams }) {
  const values = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) query.append(key, item);
  }
  permanentRedirect(signatureExplorerDestination(query.size ? `?${query}` : ""));
}
