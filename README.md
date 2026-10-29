# Rose & Keise Esmaltaria

Site (landing page) feito com React, Vite, TypeScript e Bun.

## Rodar no computador

```powershell
bun install
```

```powershell
bun run dev
```

## Gerar a versão final

```powershell
bun run build
```

A saída fica na pasta `dist/`.

## Onde editar

- Textos, telefone, endereço, Instagram, nomes dos serviços e fotos do carrossel: `src/content.ts`
- Fotos: `public/images/` (`fachada.webp` e a pasta `trabalhos/`). Para trocar uma foto, substitua o arquivo mantendo o nome.
- Frames da animação da abertura: `public/frames/`
- Cores, fontes e espaçamentos: `src/styles.css`

## SEO e leitura por IAs

- O build gera sozinho `robots.txt`, `llms.txt`, `sitemap.xml` e os dados estruturados (JSON-LD) a partir do `src/content.ts`.
- A página já sai **pré-renderizada** no `index.html`, então buscadores e IAs que não executam JavaScript enxergam todo o texto.
- Defina a variável `SITE_URL` (ex.: `https://www.seudominio.com.br`, sem barra no final) para gerar também o `sitemap.xml`,
  a tag canonical e a imagem de compartilhamento (`public/og-image.jpg`). Na Cloudflare:
  Settings > Variables and secrets. Localmente, copie `.env.example` para `.env`.

## Publicação (Cloudflare Pages)

- Build command: `bun run build`
- Build output directory: `dist`
- Production branch: `main`

Enquanto o site estiver só no endereço de teste (`pages.dev`), o bloco marcado no arquivo `public/_headers`
pede aos buscadores para não indexar. Quando o domínio definitivo entrar no ar, apague **só esse bloco**
(as regras de cache e segurança ficam).
