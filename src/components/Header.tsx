import { useEffect, useState, type CSSProperties } from "react";
import { brand, header, nav } from "../content";
import { instagramLink, whatsappLink } from "../lib/links";
import BrandMark from "./BrandMark";
import InstagramIcon from "./InstagramIcon";

// Ícones da barra flutuante (um por item do menu, na ordem de "nav" em content.ts).
const ICONS: Record<string, string[]> = {
  servicos: [
    "M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9L11 3z",
    "M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z",
  ],
  trabalhos: [
    "M6 4h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z",
    "M3.5 17l5-5 4 4 3-3 5 5",
    "M9 9.5a1.2 1.2 0 1 0 0-.01",
  ],
  sobre: ["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"],
  contato: ["M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7.5L6 20.5V17a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
};

// Seções sem botão próprio acendem o botão da seção vizinha.
const TAB_OF: Record<string, string> = { comunicado: "trabalhos", marcas: "sobre" };
const WATCHED = [...nav.map((item) => item.href.slice(1)), ...Object.keys(TAB_OF)];

function TabIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {(ICONS[id] ?? []).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [past, setPast] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const onScroll = () => {
      setSolid(window.scrollY > 48);
      setPast(window.scrollY > 120);
      // Dentro da hero nenhum item do menu fica marcado.
      if (hero && hero.getBoundingClientRect().bottom > window.innerHeight * 0.5) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Marca no menu a seção que está no meio da tela.
    const sections = WATCHED.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(TAB_OF[entry.target.id] ?? entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // A barra flutuante entra quando a animação de abertura termina (ou assim que a pessoa rola a página).
  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) {
      setHeroReady(true);
      return;
    }
    const sync = () => setHeroReady(hero.dataset.ready === "true");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(hero, { attributes: true, attributeFilter: ["data-ready"] });
    return () => observer.disconnect();
  }, []);

  const activeIndex = nav.findIndex((item) => item.href.slice(1) === active);

  return (
    <>
      <header className="site-header" data-solid={solid}>
        <a className="brand" href="#inicio" aria-label="Rose & Keise, ir para o início">
          <BrandMark />
        </a>

        <div className="header__actions">
          <a
            className="header__ig"
            href={instagramLink()}
            target="_blank"
            rel="noreferrer"
            aria-label={`${header.instagram} @${brand.instagramUser}`}
          >
            <InstagramIcon />
          </a>
          <a className="btn btn--light btn--small header__cta" href={whatsappLink()} target="_blank" rel="noreferrer">
            {header.cta}
          </a>
        </div>
      </header>

      {/* Barra flutuante de vidro: o recorte e a bolha dourada deslizam até a seção ativa. */}
      <div
        className="dock"
        data-visible={heroReady || past}
        data-has={activeIndex >= 0}
        style={{ "--i": Math.max(activeIndex, 0), "--n": nav.length } as CSSProperties}
      >
        <div className="dock__bar" aria-hidden="true" />
        <span className="dock__ring" aria-hidden="true" />
        <span className="dock__bubble" aria-hidden="true">
          {nav.map((item) => (
            <span key={item.href} className="dock__bubble-icon" data-on={item.href.slice(1) === active}>
              <TabIcon id={item.href.slice(1)} />
            </span>
          ))}
        </span>
        <nav className="dock__nav" aria-label="Principal">
          {nav.map((item) => (
            <a
              key={item.href}
              className="dock__item"
              href={item.href}
              aria-current={active === item.href.slice(1) ? "true" : undefined}
            >
              <TabIcon id={item.href.slice(1)} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
