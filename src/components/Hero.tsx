import { useEffect, useRef } from "react";
import { hero } from "../content";
import Ornament from "./Ornament";

const FRAME_COUNT = 79;
const FRAME_W = 720;
const FRAME_H = 1280;
const LAST = FRAME_COUNT - 1;
// Duração da animação que toca sozinha quando o site abre.
const AUTOPLAY_MS = 3600;
// A animação começa quando os primeiros frames estão prontos (não precisa esperar os 79).
const AUTOPLAY_START_FRAMES = 24;
// Se mesmo assim demorar, começa depois desse tempo (e espera os frames que faltam, se preciso).
const AUTOPLAY_MAX_WAIT_MS = 3500;
// Quantos frames baixam ao mesmo tempo (em ordem, para os primeiros chegarem logo).
const MAX_PARALLEL_LOADS = 6;

const framePath = (index: number) =>
  `${import.meta.env.BASE_URL}frames/frame-${String(index + 1).padStart(3, "0")}.webp`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const backdrop = backdropRef.current;
    const canvas = frameRef.current;
    if (!section || !stage || !backdrop || !canvas) return;

    const ctx = canvas.getContext("2d");
    const bgCtx = backdrop.getContext("2d");
    if (!ctx || !bgCtx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT).fill(undefined);

    let cancelled = false;
    let autoRaf = 0;
    let waitTimer = 0;
    let frontier = 0; // quantos frames seguidos (a partir do primeiro) já estão prontos
    const done: boolean[] = new Array(FRAME_COUNT).fill(false);
    let nextToLoad = 0;
    let inFlight = 0;
    let autoStarted = false;
    let drawnKey = "";
    let pos = 0; // posição atual da animação (em frames)

    // A animação toca uma única vez quando o site abre e fica parada no último frame (logo visível).
    // Ela NÃO acompanha mais o scroll. Se a pessoa pede "reduzir movimento", ou se a página abre
    // já rolada para baixo (ex.: ao recarregar), vai direto para o último frame.
    let autoplay = !reduced && window.scrollY <= 50;
    let finished = !autoplay;
    section.dataset.ready = autoplay ? "false" : "true";

    // Índice do frame carregado mais próximo (desce primeiro, depois sobe).
    const nearest = (index: number) => {
      let k = index;
      while (k >= 0 && !images[k]) k--;
      if (k < 0) {
        k = index;
        while (k < FRAME_COUNT && !images[k]) k++;
      }
      return k >= 0 && k < FRAME_COUNT ? k : -1;
    };

    // Desenha numa posição fracionada: mistura o frame atual com o próximo.
    // O vídeo tem ~24 quadros/s e a tela atualiza a 60 Hz; sem a mistura, cada quadro
    // fica 2 ou 3 atualizações na tela e o movimento "engasga". Com ela, fica contínuo.
    const render = (p: number) => {
      const clamped = Math.min(LAST, Math.max(0, p));
      const i0 = Math.floor(clamped);
      const f = Math.round((clamped - i0) * 16) / 16;
      const a = nearest(i0);
      if (a < 0) return;
      const b = f > 0 ? nearest(Math.min(i0 + 1, LAST)) : a;
      const key = `${a}:${b}:${f}`;
      if (key === drawnKey) return;
      const imgA = images[a];
      const imgB = images[b];
      if (!imgA) return;
      ctx.globalAlpha = 1;
      ctx.drawImage(imgA, 0, 0, FRAME_W, FRAME_H);
      if (imgB && b !== a && f > 0) {
        ctx.globalAlpha = f;
        ctx.drawImage(imgB, 0, 0, FRAME_W, FRAME_H);
        ctx.globalAlpha = 1;
      }
      drawnKey = key;
    };

    // Modo "parado": só mostra o último frame quando todos já chegaram (sem piscar frames intermediários).
    const showFinal = () => {
      if (frontier >= FRAME_COUNT) render(LAST);
    };

    // Fundo: estende as bordas do frame até as bordas da tela, suavizadas, para não haver emenda.
    const paintBackdrop = () => {
      const first = images[0];
      if (!first) return;
      const stageRect = stage.getBoundingClientRect();
      const frameRect = canvas.getBoundingClientRect();
      if (stageRect.width === 0 || frameRect.width === 0) return;

      const k = 0.5;
      const w = Math.max(1, Math.round(stageRect.width * k));
      const h = Math.max(1, Math.round(stageRect.height * k));
      backdrop.width = w;
      backdrop.height = h;

      const fl = (frameRect.left - stageRect.left) * k;
      const ft = (frameRect.top - stageRect.top) * k;
      const fw = frameRect.width * k;
      const fh = frameRect.height * k;

      bgCtx.fillStyle = "#A17176";
      bgCtx.fillRect(0, 0, w, h);
      bgCtx.imageSmoothingEnabled = true;
      bgCtx.imageSmoothingQuality = "high";

      const soft = (
        sx: number, sy: number, sw: number, sh: number,
        tw: number, th: number,
        dx: number, dy: number, dw: number, dh: number,
      ) => {
        if (dw < 0.5 || dh < 0.5) return;
        const tmp = document.createElement("canvas");
        tmp.width = tw;
        tmp.height = th;
        const tctx = tmp.getContext("2d");
        if (!tctx) return;
        tctx.imageSmoothingQuality = "high";
        tctx.drawImage(first, sx, sy, sw, sh, 0, 0, tw, th);
        bgCtx.drawImage(tmp, 0, 0, tw, th, dx, dy, dw, dh);
      };

      // O frame tem as bordas esmaecidas por máscara no CSS. As faixas de cor se estendem por baixo
      // dessa área para a transição ficar limpa, sem emenda.
      const desktop = window.matchMedia("(min-width: 820px)").matches;
      const extL = desktop ? fw * 0.14 : 0;
      const extR = desktop ? fw * 0.04 : 0;
      const extT = desktop ? 0 : fh * 0.14;
      soft(0, 0, 2, FRAME_H, 1, 14, 0, ft, fl + extL, fh); // esquerda
      soft(FRAME_W - 2, 0, 2, FRAME_H, 1, 14, fl + fw - extR, ft, w - (fl + fw - extR), fh); // direita
      soft(0, 0, FRAME_W, 2, 14, 1, fl, 0, fw, ft + extT); // topo
      soft(0, FRAME_H - 2, FRAME_W, 2, 14, 1, fl, ft + fh, fw, h - (ft + fh)); // base
    };

    // Animação que toca sozinha quando o site abre e termina parada no último frame.
    const beginAutoplay = () => {
      if (!autoplay || autoStarted || cancelled) return;
      autoStarted = true;
      window.clearTimeout(waitTimer);
      const speed = LAST / AUTOPLAY_MS; // quadros por milissegundo
      let last = 0;
      const tick = (now: number) => {
        if (cancelled) return;
        const dt = last ? Math.min(now - last, 64) : 0; // primeiro quadro sem salto
        last = now;
        // Nunca passa do último frame já pronto: em conexão lenta, espera ele chegar.
        const limit = frontier >= FRAME_COUNT ? LAST : Math.max(0, frontier - 1);
        pos = Math.min(pos + dt * speed, limit);
        render(pos);
        if (pos < LAST) {
          autoRaf = requestAnimationFrame(tick);
          return;
        }
        // Terminou: fica parada no último frame.
        autoplay = false;
        finished = true;
        section.dataset.ready = "true";
      };
      autoRaf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      paintBackdrop();
      drawnKey = "";
      if (finished) showFinal();
      else render(pos);
    };

    // Carrega e já decodifica cada frame, em fila: os primeiros chegam primeiro e o
    // primeiro desenho de cada frame não trava a animação.
    const pump = () => {
      while (inFlight < MAX_PARALLEL_LOADS && nextToLoad < FRAME_COUNT) loadFrame(nextToLoad++);
    };
    const loadFrame = (index: number) => {
      inFlight++;
      const img = new Image();
      img.decoding = "async";
      const finish = (ok: boolean) => {
        inFlight--;
        if (cancelled) return;
        if (ok) images[index] = img;
        done[index] = true;
        while (frontier < FRAME_COUNT && done[frontier]) frontier++;
        if (ok && index === 0) paintBackdrop();
        drawnKey = "";
        if (finished) showFinal();
        else if (!autoStarted) render(0); // mostra o primeiro frame enquanto os outros chegam
        if (autoplay && frontier >= AUTOPLAY_START_FRAMES) beginAutoplay();
        pump();
      };
      img.src = framePath(index);
      img.decode().then(
        () => finish(true),
        () => finish(false),
      );
    };

    window.addEventListener("resize", onResize);
    if (autoplay) waitTimer = window.setTimeout(beginAutoplay, AUTOPLAY_MAX_WAIT_MS);
    pump();

    return () => {
      cancelled = true;
      if (autoRaf) cancelAnimationFrame(autoRaf);
      window.clearTimeout(waitTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero" id="inicio" data-ready="false">
      <div ref={stageRef} className="hero__stage">
        <canvas ref={backdropRef} className="hero__backdrop" aria-hidden="true" />
        <canvas
          ref={frameRef}
          className="hero__frame"
          width={FRAME_W}
          height={FRAME_H}
          role="img"
          aria-label="Animação de um frasco de esmalte rosa sendo aberto, com a logo Rose & Keise Esmaltaria surgindo"
        />

        <Ornament side="left" variant="hero" />
        <Ornament side="right" variant="hero" />

        {/* Legendas verticais decorativas, só em telas largas (ocupam as laterais do desktop). */}
        <p className="hero__side hero__side--left" aria-hidden="true">
          {hero.sideLeft}
        </p>
        <p className="hero__side hero__side--right" aria-hidden="true">
          {hero.sideRight}
        </p>

        <h1 className="sr-only">Rose &amp; Keise Esmaltaria. {hero.title}</h1>

        <div className="hero__actions">
          <a className="btn btn--line" href="#trabalhos">
            {hero.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
