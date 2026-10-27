// Roda depois do build do cliente: gera o HTML da página e coloca dentro de dist/index.html (pré-renderização).
// Assim buscadores e IAs que não executam JavaScript já enxergam todo o texto do site.
//
// O build do servidor (SSR) acontece aqui dentro, pela API do Vite e sem o vite.config.ts, para que
// plugins injetados no build pela Cloudflare não interfiram nele.
//
// Se algo der errado aqui, o site NÃO deixa de ir ao ar: ele publica normalmente, só sem o HTML
// pré-renderizado (o React monta a página no navegador). O motivo aparece no log do build.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const root = process.cwd();
const indexPath = path.join(root, "dist", "index.html");
const ssrDir = path.join(root, ".ssr");
const serverEntry = path.join(ssrDir, "entry-server.js");
const marker = '<div id="root"></div>';

const describe = (error) => (error instanceof Error ? error.message : String(error));

// Um erro assíncrono solto não pode derrubar o build inteiro.
process.on("unhandledRejection", (reason) => {
  console.warn(`AVISO: erro assíncrono ignorado na pré-renderização. Motivo: ${describe(reason)}`);
});

try {
  await build({
    root,
    configFile: false,
    logLevel: "warn",
    plugins: [react()],
    build: {
      ssr: "src/entry-server.tsx",
      outDir: ssrDir,
      emptyOutDir: true,
      copyPublicDir: false,
    },
  });

  const mod = await import(pathToFileURL(serverEntry).href);
  if (typeof mod.render !== "function") {
    throw new Error(`o arquivo do servidor não exporta "render" (exporta: ${Object.keys(mod).join(", ") || "nada"})`);
  }

  const html = await readFile(indexPath, "utf8");
  if (!html.includes(marker)) throw new Error(`não achei ${marker} em dist/index.html`);

  const app = mod.render();
  await writeFile(indexPath, html.replace(marker, () => `<div id="root">${app}</div>`));
  console.log("Pré-renderização concluída -> dist/index.html");
} catch (error) {
  console.warn(`AVISO: pré-renderização ignorada, o site vai ao ar sem ela. Motivo: ${describe(error)}`);
}