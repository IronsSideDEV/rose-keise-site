import { useEffect, useRef, useState, type CSSProperties } from "react";
import { booking, works, worksSection } from "../content";
import { whatsappLink } from "../lib/links";

const INTERVAL_MS = 4200;

export default function WorksCarousel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // Quem pede "reduzir movimento" começa com o carrossel parado (e pode dar play).
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  // Só avança quando o carrossel está visível na tela.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const running = playing && inView && !hovered && !focused;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % works.length), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [index, running]);

  const go = (i: number) => setIndex((i + works.length) % works.length);
  const current = works[index];

  return (
    <div
      ref={rootRef}
      className="works"
      role="group"
      aria-roledescription="carrossel"
      aria-label={worksSection.worksLabel}
      style={{ "--works-interval": `${INTERVAL_MS}ms` } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="works__nail">
        <div className="works__photo">
          {works.map((work, i) => (
            <img
              key={work.image}
              className="works__img"
              data-active={i === index}
              src={`${import.meta.env.BASE_URL}${work.image}`}
              alt={work.alt}
              width={work.width}
              height={work.height}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              aria-hidden={i !== index}
              style={{ objectPosition: work.position }}
            />
          ))}
        </div>
      </div>

      <p className="works__name" aria-live={running ? "off" : "polite"}>
        {current.service}
      </p>

      <div className="works__controls">
        <button type="button" className="works__btn" aria-label={worksSection.prev} onClick={() => go(index - 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <polyline points="15 5 8 12 15 19" />
          </svg>
        </button>

        <div className="works__dots">
          {works.map((work, i) => (
            <button
              key={work.service}
              type="button"
              className="works__dot"
              aria-label={work.service}
              aria-current={i === index}
              onClick={() => go(i)}
            >
              <span className="works__dot-track">
                {i === index && (
                  <span key={`${index}-${running}`} className="works__dot-fill" data-running={running} />
                )}
              </span>
            </button>
          ))}
        </div>

        <button type="button" className="works__btn" aria-label={worksSection.next} onClick={() => go(index + 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <polyline points="9 5 16 12 9 19" />
          </svg>
        </button>

        <button
          type="button"
          className="works__btn"
          aria-label={playing ? worksSection.pause : worksSection.play}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <line x1="9" y1="6" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <polygon points="8 5 19 12 8 19" />
            </svg>
          )}
        </button>
      </div>

      <a
        className="btn btn--light btn--small"
        href={whatsappLink(booking.message(current.service))}
        target="_blank"
        rel="noreferrer"
      >
        {booking.cta}
      </a>
    </div>
  );
}
