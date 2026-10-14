# Google Search Console — lista de verificación (4 pasos)

Propiedad: `https://ogdevsecops.sytes.net`

1. **Crear la propiedad** — Abrir [Google Search Console](https://search.google.com/search-console), elegir *Propiedad de dominio* (o *Prefijo de URL* con `https://ogdevsecops.sytes.net/`) y agregar la propiedad.
2. **Verificar por DNS** — Copiar el registro TXT que entrega Google y agregarlo en el proveedor de DNS del dominio `sytes.net`; volver a Search Console y pulsar *Verificar*.
3. **Enviar el sitemap** — En *Sitemaps* → `https://search.google.com/search-console/sitemaps`, escribir `sitemap.xml` y pulsar *Enviar*.
4. **Inspección de URL** — En *Inspección de URL*, consultar `https://ogdevsecops.sytes.net/` y solicitar *Indexar* para acelerar la primera indexación.

> Nota: el sitio solo tiene una página (`/`). Si se agregan rutas, actualizar `public/sitemap.xml` y reenviar el sitemap.
