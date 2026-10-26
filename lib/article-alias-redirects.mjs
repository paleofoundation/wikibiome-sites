import articleIdentityRegistry from "../data/article-id-aliases.json" with { type: "json" };

export const ARTICLE_ALIAS_SUFFIXES = ["", "/history", "/suggest"];

export const articleAliasRedirects = Object.freeze(
  Object.entries(articleIdentityRegistry.aliases).flatMap(([alias, target]) => (
    ARTICLE_ALIAS_SUFFIXES.map((suffix) => Object.freeze({
      source: `/article/${alias}${suffix}`,
      destination: `/article/${target}${suffix}`,
      permanent: true,
    }))
  )),
);
