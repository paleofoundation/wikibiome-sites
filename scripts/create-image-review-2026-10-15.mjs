import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const source = process.argv[2];
if (!source) throw new Error("Pass original candidate directory.");
const records = JSON.parse(await readFile("data/image-review-2026-10-15.json", "utf8"));
await mkdir("public/image-review-files/2026-10-15", {recursive:true});
const xml = v => String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
for (const r of records) {
 const alt=(key,value)=>`<${key}><rdf:Alt><rdf:li xml:lang="x-default">${xml(value)}</rdf:li></rdf:Alt></${key}>`;
 const xmp = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:iptcExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/" xmlns:wb="https://wikibiome.com/ns/media/2.0/">${alt("dc:title",r.title)}${alt("dc:description",r.description)}<dc:creator><rdf:Seq><rdf:li>${xml(r.credit)}</rdf:li></rdf:Seq></dc:creator><dc:subject><rdf:Bag>${r.keywords.map(k=>`<rdf:li>${xml(k)}</rdf:li>`).join("")}</rdf:Bag></dc:subject><photoshop:Credit>${xml(r.credit)}</photoshop:Credit><photoshop:Headline>${xml(r.caption)}</photoshop:Headline><photoshop:DateCreated>${r.created}</photoshop:DateCreated><iptcExt:DigitalSourceType>${r.digitalSourceType}</iptcExt:DigitalSourceType><xmpRights:WebStatement>${r.license}</xmpRights:WebStatement><wb:AltText>${xml(r.alt)}</wb:AltText><wb:PublicationStatus>unapproved-draft</wb:PublicationStatus><wb:CanonicalArticle>${r.canonicalArticleUrl}</wb:CanonicalArticle><wb:OriginalSourceSha256>${r.sha256}</wb:OriginalSourceSha256><wb:PromptSha256>${r.promptSha256}</wb:PromptSha256><wb:ReviewNote>${xml(r.assistantVisualReview)}</wb:ReviewNote></rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
 const dest=resolve("public/image-review-files/2026-10-15",r.previewFile);
 await sharp(resolve(source,r.file)).withXmp(xmp).webp({quality:92}).toFile(dest);
 const m=await sharp(dest).metadata();
 if(m.width!==1536 || m.height!==1024 || !m.xmp?.toString().includes("unapproved-draft")) throw new Error("Metadata validation failed: "+r.pageId);
 console.log(r.pageId+": dimensions and embedded XMP verified");
}
