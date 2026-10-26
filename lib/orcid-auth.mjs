const messages = {
  not_configured: {
    title: "ORCID sign-in is not active yet.",
    detail: "WikiBiome still needs its ORCID application credentials connected. No account was created and no information was sent to ORCID.",
  },
  configuration_error: {
    title: "ORCID sign-in is temporarily unavailable.",
    detail: "WikiBiome's ORCID connection is incomplete. No account changes were made.",
  },
  invalid_state: {
    title: "That ORCID sign-in link expired.",
    detail: "For your security, ORCID sign-in links are single-use. Start the sign-in again when you are ready.",
  },
  cancelled: {
    title: "ORCID sign-in was cancelled.",
    detail: "No account changes were made. You can start again at any time.",
  },
  token_error: {
    title: "ORCID could not complete sign-in.",
    detail: "The authorization response could not be verified. Please try again, or contact WikiBiome if the problem continues.",
  },
  identity_error: {
    title: "ORCID did not return a valid iD.",
    detail: "No account was created. Please try again, or contact WikiBiome if the problem continues.",
  },
};

export function getOrcidAuthMessage(status) {
  return typeof status === "string" && Object.hasOwn(messages, status) ? messages[status] : null;
}

export function appendOrcidStatus(returnTo, status) {
  const safePath = typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//")
    ? returnTo
    : "/researcher/dashboard";
  const target = new URL(safePath, "https://wikibiome.invalid");
  target.searchParams.set("orcid", getOrcidAuthMessage(status) ? status : "configuration_error");
  return `${target.pathname}${target.search}${target.hash}`;
}
