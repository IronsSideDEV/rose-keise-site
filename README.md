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

## Publicação (Cloudflare Pages)

- Build command: `bun run build`
- Build output directory: `dist`
- Production branch: `main`

Enquanto o site estiver só no endereço de teste (`pages.dev`), o arquivo `public/_headers` pede aos
buscadores para não indexar. Apague esse arquivo quando o domínio definitivo entrar no ar.
