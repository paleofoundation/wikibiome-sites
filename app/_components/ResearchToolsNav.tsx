import Link from "@/app/_components/NativeLink";

const tools = [
  { id: "graph", href: "/explore", label: "Knowledge graph", description: "Follow article relationships" },
  { id: "clusters", href: "/clusters", label: "Condition clusters", description: "Find signature neighborhoods" },
  { id: "compare", href: "/compare", label: "Compare conditions", description: "Inspect shared and unique signals" },
  { id: "keystone", href: "/keystone", label: "Keystone studies", description: "Audit structural evidence" },
] as const;

export function ResearchToolsNav({ active }: { active: (typeof tools)[number]["id"] }) {
  return (
    <nav className="research-tools-nav" aria-label="WikiBiome research tools">
      {tools.map((tool, index) => (
        <Link className={tool.id === active ? "active" : ""} href={tool.href} aria-current={tool.id === active ? "page" : undefined} key={tool.id}>
          <i>{String(index + 1).padStart(2, "0")}</i>
          <span><strong>{tool.label}</strong><small>{tool.description}</small></span>
        </Link>
      ))}
    </nav>
  );
}
