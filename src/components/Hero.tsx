import { useEffect, useRef } from "react";
import { hero } from "../content";

const FRAME_COUNT = 79;
const FRAME_W = 720;
const FRAME_H = 1280;
// Duração da animação que toca sozinha quando o site abre.
const AUTOPLAY_MS = 3600;
// Se os frames demorarem a carregar, começa a animação mesmo assim depois desse tempo.
const AUTOPLAY_MAX_WAIT_MS = 3500;
// Fração do scroll usada pela animação; o restante "segura" o último estado.
const SCROLL_SPAN = 0.88;

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
    let raf = 0;
    let autoRaf = 0;
    let waitTimer = 0;
    let finishedCount = 0;
    let autoStarted = false;
    let drawnKey = "";

    // Toca sozinha só na primeira entrada no topo da página (sem movimento reduzido).
    let autoplay = !reduced && window.scrollY <= 50;

    // No topo da página o estado é o final da animação (logo visível).
    // Ao rolar para baixo a animação volta (frasco fecha); ao voltar a rolar para cima, ela toca de novo.
    const readScrollTarget = () => {
      if (reduced) return 1;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      const progress = Math.min(1, Math.max(0, raw / SCROLL_SPAN));
      return 1 - progress;
    };

    let target = autoplay ? 0 : readScrollTarget();
    let current = target;
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
    const render = (pos: number) => {
      const clamped = Math.min(FRAME_COUNT - 1, Math.max(0, pos));
      const i0 = Math.floor(clamped);
      const f = Math.round((clamped - i0) * 16) / 16;
      const a = nearest(i0);
      if (a < 0) return;
      const b = f > 0 ? nearest(Math.min(i0 + 1, FRAME_COUNT - 1)) : a;
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
      soft(0, 0, 2, FRAME_H, 1, 24, 0, ft, fl + extL, fh); // esquerda
      soft(FRAME_W - 2, 0, 2, FRAME_H, 1, 24, fl + fw - extR, ft, w - (fl + fw - extR), fh); // direita
      soft(0, 0, FRAME_W, 2, 24, 1, fl, 0, fw, ft + extT); // topo
      soft(0, FRAME_H - 2, FRAME_W, 2, 24, 1, fl, ft + fh, fw, h - (ft + fh)); // base
    };

    // Suavização do scroll (só depois que a animação inicial terminou).
    const step = () => {
      raf = 0;
      if (!autoplay) {
        current += (target - current) * 0.16;
        if (Math.abs(target - current) < 0.0004) current = target;
      }
      render(current * (FRAME_COUNT - 1));
      if (!autoplay && current !== target) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    // Animação que toca sozinha quando o site abre.
    const beginAutoplay = () => {
      if (!autoplay || autoStarted || cancelled) return;
      autoStarted = true;
      window.clearTimeout(waitTimer);
      let t0 = 0;
      const tick = (now: number) => {
        if (cancelled) return;
        if (!t0) t0 = now; // começa no primeiro quadro da tela, sem salto
        const p = Math.min(1, (now - t0) / AUTOPLAY_MS);
        current = p;
        target = p;
        render(p * (FRAME_COUNT - 1));
        if (p < 1) {
          autoRaf = requestAnimationFrame(tick);
          return;
        }
        // Terminou: a partir daqui quem manda é o scroll.
        autoplay = false;
        section.dataset.ready = "true";
        target = readScrollTarget();
        kick();
      };
      autoRaf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (autoplay) return;
      target = readScrollTarget();
      kick();
    };
    const onResize = () => {
      paintBackdrop();
      if (!autoplay) target = readScrollTarget();
      drawnKey = "";
      kick();
    };

    // Carrega e já decodifica cada frame, para o primeiro desenho de cada um não travar a animação.
    const loadFrame = (index: number) => {
      const img = new Image();
      img.decoding = "async";
      const finish = (ok: boolean) => {
        if (cancelled) return;
        if (ok) images[index] = img;
        finishedCount++;
        if (ok && index === 0) paintBackdrop();
        drawnKey = "";
        kick();
        if (finishedCount === FRAME_COUNT) beginAutoplay();
      };
      img.src = framePath(index);
      img.decode().then(
        () => finish(true),
        () => finish(false),
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (autoplay) waitTimer = window.setTimeout(beginAutoplay, AUTOPLAY_MAX_WAIT_MS);
    for (let i = 0; i < FRAME_COUNT; i++) loadFrame(i);

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (autoRaf) cancelAnimationFrame(autoRaf);
      window.clearTimeout(waitTimer);
      window.removeEventListener("scroll", onScroll);
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
