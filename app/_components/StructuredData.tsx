export function StructuredData({ data, marker }: { data: unknown; marker?: string }) {
  return (
    <script
      type="application/ld+json"
      {...(marker ? { [marker]: "true" } : {})}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }}
    />
  );
}
