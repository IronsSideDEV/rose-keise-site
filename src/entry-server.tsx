import { renderToString } from "react-dom/server";
import App from "./App";

// Usado só no build (scripts/prerender.mjs): gera o HTML da página para ir pronto no index.html.
export function render() {
  return renderToString(<App />);
}
