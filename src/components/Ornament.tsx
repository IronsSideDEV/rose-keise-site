import { useEffect, useId, useRef, useState } from "react";
import type { Shape } from "../lib/ornamentData";

// Os dados do desenho ficam num arquivo separado, baixado só em telas largas.
type OrnamentData = typeof import("../lib/ornamentData");

type Props = {
  side: "left" | "right";
  // "hero": aparece quando a animação de abertura termina. "section": aparece ao rolar até ela.
  variant?: "hero" | "section";
};

function renderShape(shape: Shape, key: string) {
  return shape.k === "p" ? (
    <path key={key} transform={shape.t} d={shape.d} />
  ) : (
    <circle key={key} cx={shape.cx} cy={shape.cy} r={shape.r} />
  );
}

// Arabesco floral dourado (decorativo). Só aparece em telas largas, nas laterais.
export default function Ornament({ side, variant = "section" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const stroke = `gs${id}`;
  const fill = `gf${id}`;
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);
  // Só desenha no navegador (não entra no HTML pré-renderizado). O CSS decide onde cada ramo aparece.
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = useState<OrnamentData | null>(null);

  useEffect(() => {
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || data) return;
    let alive = true;
    import("../lib/ornamentData").then((module) => {
      if (alive) setData(module);
    });
    return () => {
      alive = false;
    };
  }, [enabled, data]);

  useEffect(() => {
    if (!enabled || !data || variant === "hero") return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, enabled, data]);

  if (!enabled || !data) return null;

  return (
    <svg
      ref={ref}
      className={`ornament ornament--${side} ornament--${variant}`}
      data-show={shown}
      viewBox={data.ORNAMENT_VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={stroke} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="260" y2="900">
          <stop offset="0" stopColor="#8a6212" />
          <stop offset=".16" stopColor="#d6a93b" />
          <stop offset=".30" stopColor="#fff2b4" />
          <stop offset=".42" stopColor="#c9972b" />
          <stop offset=".55" stopColor="#7d5710" />
          <stop offset=".68" stopColor="#e3bb52" />
          <stop offset=".78" stopColor="#fff6c8" />
          <stop offset=".90" stopColor="#b98a24" />
          <stop offset="1" stopColor="#7a5410" />
        </linearGradient>
        <linearGradient id={fill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9972b" />
          <stop offset=".22" stopColor="#f6dc82" />
          <stop offset=".42" stopColor="#fff6c8" />
          <stop offset=".62" stopColor="#d9ac3c" />
          <stop offset=".85" stopColor="#a87a1c" />
          <stop offset="1" stopColor="#8a6212" />
        </linearGradient>
      </defs>

      <g fill="none" stroke={`url(#${stroke})`} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {data.STROKES.map((d, i) => (
          <path key={i} className="draw" pathLength={1} d={d} />
        ))}
      </g>
      <g className="bloom bloom--leaves" fill={`url(#${fill})`} stroke="#8a6212" strokeWidth=".8" strokeLinejoin="round">
        {data.LEAVES.map((s, i) => renderShape(s, `l${i}`))}
      </g>
      <g className="bloom bloom--flowers" fill={`url(#${fill})`} stroke="#8a6212" strokeWidth=".8" strokeLinejoin="round">
        {data.FLOWERS.map((s, i) => renderShape(s, `f${i}`))}
        {data.DOTS.map((s, i) => renderShape(s, `d${i}`))}
      </g>
    </svg>
  );
}
