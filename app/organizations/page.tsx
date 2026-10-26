import { permanentRedirect } from "next/navigation";

export default async function OrganizationsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  permanentRedirect(`/institutions${q?.trim() ? `?q=${encodeURIComponent(q.trim().slice(0, 200))}` : ""}`);
}
