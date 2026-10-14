import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  // La fecha del build = instantánea de contenido: lastmod siempre igual al deploy.
  const lastmod = new Date().toISOString().slice(0, 10);
  const loc = new URL("/", site).href;
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>` +
    `</urlset>\n`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
