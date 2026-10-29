import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { about, brand, works } from "./src/content.ts";

declare const process: { cwd(): string };

// Gera robots.txt, sitemap.xml, llms.txt e os dados estruturados (JSON-LD) a partir de src/content.ts.
// Endereço do site (para sitemap, canonical e imagem de compartilhamento): variável SITE_URL.
//   Ex.: SITE_URL=https://www.roseekeise.com.br   (sem barra no final)
// Sem SITE_URL, o sitemap e as tags que exigem endereço completo simplesmente não são gerados.
function seoPlugin(siteUrl: string): Plugin {
  const services = [...new Set(works.map((work) => work.service))];
  const [locality, region] = brand.city.split(",").map((part) => part.trim());
  const title = `${brand.name} ${brand.kind}`;
  const summary = `${brand.kind} no ${brand.district}, em ${brand.city}. Serviços: ${services.join(", ")}. Agendamento pelo WhatsApp.`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.mapsQuery)}`;
  const instagramUrl = `https://instagram.com/${brand.instagramUser}`;
  const whatsappUrl = `https://wa.me/${brand.whatsappNumber}`;
  const imageUrl = `${siteUrl}/og-image.jpg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: title,
    description: summary,
    telephone: `+${brand.whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.street,
      addressLocality: locality,
      addressRegion: region,
      addressCountry: "BR",
    },
    hasMap: mapsUrl,
    sameAs: [instagramUrl],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços",
      itemListElement: services.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
    ...(siteUrl ? { url: `${siteUrl}/`, image: imageUrl } : {}),
  };

  const robots = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Buscadores e assistentes de IA liberados de forma explícita",
    "User-agent: GPTBot",
    "User-agent: OAI-SearchBot",
    "User-agent: ChatGPT-User",
    "User-agent: ClaudeBot",
    "User-agent: Claude-SearchBot",
    "User-agent: Claude-User",
    "User-agent: PerplexityBot",
    "User-agent: Google-Extended",
    "Allow: /",
    ...(siteUrl ? ["", `Sitemap: ${siteUrl}/sitemap.xml`] : []),
    "",
  ].join("\n");

  const llms = [
    `# ${title}`,
    "",
    `> ${summary}`,
    "",
    "## Sobre",
    ...about.paragraphs.map((paragraph) => `- ${paragraph}`),
    "",
    "## Serviços",
    ...services.map((service) => `- ${service}`),
    "",
    "## Contato e localização",
    `- Endereço: ${brand.street}, ${brand.district}, ${brand.city}`,
    `- WhatsApp: ${brand.whatsappDisplay} (${whatsappUrl})`,
    `- Instagram: @${brand.instagramUser} (${instagramUrl})`,
    `- Mapa: ${mapsUrl}`,
    ...(brand.hours.length > 0
      ? ["", "## Horários", ...brand.hours.map((hour) => `- ${hour.days}: ${hour.time}`)]
      : []),
    ...(siteUrl
      ? ["", "## Páginas", `- [Início](${siteUrl}/): apresentação, trabalhos, sobre o espaço e contato`]
      : []),
    "",
  ].join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>
</urlset>
`;

  return {
    name: "rose-keise-seo",
    // Não roda no build "ssr" (usado só para pré-renderizar).
    apply: (config) => !config.build?.ssr,
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          injectTo: "head",
        },
      ];
      if (siteUrl) {
        const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: "meta", attrs, injectTo: "head" });
        tags.push(
          { tag: "link", attrs: { rel: "canonical", href: `${siteUrl}/` }, injectTo: "head" },
          meta({ property: "og:url", content: `${siteUrl}/` }),
          meta({ property: "og:image", content: imageUrl }),
          meta({ property: "og:image:width", content: "1200" }),
          meta({ property: "og:image:height", content: "630" }),
          meta({ property: "og:image:alt", content: `${title}: frasco de esmalte rosa e logo` }),
          meta({ name: "twitter:card", content: "summary_large_image" }),
          meta({ name: "twitter:image", content: imageUrl }),
        );
      }
      return tags;
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
      this.emitFile({ type: "asset", fileName: "llms.txt", source: llms });
      if (siteUrl) this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.SITE_URL ?? "").trim().replace(/\/+$/, "");
  return {
    plugins: [react(), seoPlugin(siteUrl)],
  };
});
