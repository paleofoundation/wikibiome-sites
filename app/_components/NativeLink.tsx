import type { AnchorHTMLAttributes, ReactNode } from "react";

type NativeLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

/**
 * WikiBiome is deployed through vinext. Native anchors keep navigation resilient
 * when the optional client-side router is unavailable or fails to hydrate.
 */
export default function NativeLink({ href, children, ...props }: NativeLinkProps) {
  return <a href={href} {...props}>{children}</a>;
}
