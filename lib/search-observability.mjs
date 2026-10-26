export const SEARCH_SOURCES = Object.freeze(["google", "bing", "duckduckgo", "yahoo", "other-search"]);

export function classifySearchReferrer(referrer) {
  if (!referrer) return undefined;
  let hostname;
  try {
    hostname = new URL(referrer).hostname.toLowerCase();
  } catch {
    return undefined;
  }

  if (/(^|\.)google\.(?:com|[a-z]{2}|com\.[a-z]{2}|co\.[a-z]{2})$/.test(hostname)) return "google";
  if (/(^|\.)bing\.com$/.test(hostname)) return "bing";
  if (/(^|\.)duckduckgo\.com$/.test(hostname)) return "duckduckgo";
  if (/(^|\.)search\.yahoo\.(?:com|[a-z]{2}|com\.[a-z]{2}|co\.[a-z]{2})$/.test(hostname)) return "yahoo";
  if (
    /(^|\.)(?:search\.brave\.com|ecosia\.org|startpage\.com|qwant\.com|baidu\.com)$/.test(hostname)
    || /(^|\.)yandex\.(?:ru|com|by|kz|uz|com\.tr)$/.test(hostname)
  ) return "other-search";
  return undefined;
}
