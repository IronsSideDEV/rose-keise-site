// Roda depois do build: coloca o HTML da página dentro de dist/index.html (pré-renderização).
// Assim buscadores e IAs que não executam JavaScript já enxergam todo o texto do site.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const indexPath = path.join(root, "dist", "index.html");
const serverEntry = path.join(root, ".ssr", "entry-server.js");

const { render } = await import(pathToFileURL(serverEntry).href);
const html = await readFile(indexPath, "utf8");

const marker = '<div id="root"></div>';
if (!html.includes(marker)) {
  throw new Error(`Não achei ${marker} em dist/index.html. A pré-renderização foi cancelada.`);
}

const app = render();
await writeFile(indexPath, html.replace(marker, () => `<div id="root">${app}</div>`));
console.log("Pré-renderização concluída: dist/index.html");
