import { redirect } from "next/navigation";

type SearchParams = Promise<{ tags?: string }>;

export default async function LegacyTagsPage({ searchParams }: { searchParams: SearchParams }) {
  const { tags } = await searchParams;
  const query = tags?.split(",").map((tag) => tag.trim()).filter(Boolean).join(" ") ?? "";
  redirect(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
}
