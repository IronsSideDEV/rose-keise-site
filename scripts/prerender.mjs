// Roda depois do build: coloca o HTML da página dentro de dist/index.html (pré-renderização).
// Assim buscadores e IAs que não executam JavaScript já enxergam todo o texto do site.
//
// Se algo der errado aqui, o site NÃO deixa de ir ao ar: ele publica normalmente, só sem o HTML
// pré-renderizado (o React monta a página no navegador). O motivo aparece no log do build.
import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const indexPath = path.join(root, "dist", "index.html");
const marker = '<div id="root"></div>';

// O nome e a pasta do arquivo do servidor mudam conforme o ambiente de build
// (.ssr/entry-server.js ou .ssr/assets/entry-server-<código>.js).
async function findServerEntry() {
  const candidates = [path.join(root, ".ssr", "entry-server.js")];
  for (const dir of [".ssr", path.join(".ssr", "assets")]) {
    try {
      for (const file of await readdir(path.join(root, dir))) {
        if (/^entry-server.*\.m?js$/.test(file)) candidates.push(path.join(root, dir, file));
      }
    } catch {
      // pasta não existe: segue para a próxima
    }
  }
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // tenta o próximo
    }
  }
  throw new Error("não achei o arquivo do servidor em .ssr (procurei entry-server*.js)");
}

try {
  const serverEntry = await findServerEntry();
  const mod = await import(pathToFileURL(serverEntry).href);
  if (typeof mod.render !== "function") {
    throw new Error(`o arquivo ${path.basename(serverEntry)} não exporta "render" (exporta: ${Object.keys(mod).join(", ") || "nada"})`);
  }

  const html = await readFile(indexPath, "utf8");
  if (!html.includes(marker)) throw new Error(`não achei ${marker} em dist/index.html`);

  const app = mod.render();
  await writeFile(indexPath, html.replace(marker, () => `<div id="root">${app}</div>`));
  console.log(`Pré-renderização concluída (${path.relative(root, serverEntry)}) -> dist/index.html`);
} catch (error) {
  console.warn(`AVISO: pré-renderização ignorada, o site vai ao ar sem ela. Motivo: ${error instanceof Error ? error.message : error}`);
}
