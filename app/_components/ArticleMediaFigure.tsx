import {
  ARTICLE_MEDIA_LICENSE_LABEL,
  getArticleMediaAccessibilityReviewLabel,
  getArticleMediaIdentifierReviewLabel,
  getArticleMediaReviewLabel,
  type ArticleMedia,
} from "@/lib/article-media";

export function ArticleMediaFigure({ media }: { media: ArticleMedia }) {
  const identifierCount = media.scientificIdentifiers.length;

  return (
    <figure className="article-media-figure">
      <div className="article-media-stage">
        <img
          src={media.src}
          width={media.width}
          height={media.height}
          alt={media.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption>
        <header className="article-media-caption-head">
          <strong>{media.label}</strong>
          <span><i aria-hidden="true" /> Editorially reviewed</span>
        </header>
        <p>{media.caption}</p>
        <div className="article-media-attribution">{media.credit}<span aria-hidden="true"> · </span>{media.provenance}</div>
        <details className="article-media-ledger">
          <summary>
            <span>Scientific media record</span>
            <em>{identifierCount} verified {identifierCount === 1 ? "identifier" : "identifiers"}</em>
            <i aria-hidden="true" />
          </summary>
          <dl aria-label="Scientific image record">
            <div>
              <dt>Subject</dt>
              <dd>
                <span className={media.scientificName ? "scientific-name" : undefined}>{media.scientificName ?? media.subjectName}</span>
                <small>{media.subjectKind}{media.taxonomicRank ? ` · ${media.taxonomicRank}` : ""}</small>
              </dd>
            </div>
            <div>
              <dt>Identifiers</dt>
              <dd className="article-media-identifiers">{media.scientificIdentifiers.map((identifier) => (
                <a href={identifier.url} target="_blank" rel="noreferrer" key={`${identifier.propertyID}-${identifier.value}`}>{identifier.compact}<span aria-hidden="true"> ↗</span></a>
              ))}</dd>
            </div>
            <div>
              <dt>Review</dt>
              <dd>
                <span>{getArticleMediaReviewLabel(media)}</span>
                <small>{getArticleMediaIdentifierReviewLabel(media)} · {getArticleMediaAccessibilityReviewLabel(media)} · <time dateTime={media.reviewedOn}>{media.reviewedOn}</time> · {media.reviewLogKey}</small>
              </dd>
            </div>
            <div>
              <dt>Digital source</dt>
              <dd>
                <span>Trained-algorithmic media</span>
                <small>{media.disclosure}</small>
              </dd>
            </div>
            <div>
              <dt>Scientific basis</dt>
              <dd className="article-media-identifiers">{media.scientificReferences.map((reference) => (
                <a href={reference.url} target="_blank" rel="noreferrer" key={reference.url}>{reference.title}<span aria-hidden="true"> ↗</span></a>
              ))}</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>
                <a href={media.license} target="_blank" rel="license noreferrer">{ARTICLE_MEDIA_LICENSE_LABEL}<span aria-hidden="true"> ↗</span></a>
                <small>Created <time dateTime={media.created}>{media.created}</time></small>
              </dd>
            </div>
          </dl>
        </details>
      </figcaption>
    </figure>
  );
}
