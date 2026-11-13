import { useEffect, useRef, useState } from "react";
import { brand, header, nav } from "../content";
import { instagramLink, whatsappLink } from "../lib/links";
import BrandMark from "./BrandMark";
import InstagramIcon from "./InstagramIcon";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const onScroll = () => {
      setSolid(window.scrollY > 48);
      // Dentro da hero nenhum item do menu fica marcado.
      if (hero && hero.getBoundingClientRect().bottom > window.innerHeight * 0.5) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Marca no menu a seção que está no meio da tela.
    const sections = nav
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // Posiciona a pílula de vidro que desliza até a aba ativa (medida direto no DOM, sem re-render).
  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    let alive = true;
    const place = () => {
      if (!alive) return;
      const link = active ? tabs.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
      if (!link || link.offsetWidth === 0) {
        tabs.dataset.has = "false";
        return;
      }
      const firstTime = tabs.dataset.has !== "true";
      // Na primeira vez a pílula aparece já no lugar, sem deslizar a partir do canto.
      if (firstTime) tabs.dataset.snap = "true";
      tabs.style.setProperty("--pill-x", `${link.offsetLeft}px`);
      tabs.style.setProperty("--pill-y", `${link.offsetTop}px`);
      tabs.style.setProperty("--pill-w", `${link.offsetWidth}px`);
      tabs.style.setProperty("--pill-h", `${link.offsetHeight}px`);
      tabs.dataset.has = "true";
      if (firstTime) {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            delete tabs.dataset.snap;
          }),
        );
      }
    };
    place();
    window.addEventListener("resize", place);
    document.fonts.ready.then(place);
    return () => {
      alive = false;
      window.removeEventListener("resize", place);
    };
  }, [active, menuOpen]);

  return (
    <header className="site-header" data-solid={solid} data-menu={menuOpen}>
      <a className="brand" href="#inicio" aria-label="Rose & Keise, ir para o início" onClick={() => setMenuOpen(false)}>
        <BrandMark />
      </a>

      <nav className="nav" id="menu-principal" aria-label="Principal">
        <div className="nav__tabs" ref={tabsRef} data-has="false">
          <span className="nav__pill" aria-hidden="true" />
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href.slice(1) ? "true" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
        {/* No computador: só o ícone. No menu do celular: ícone e nome. */}
        <a
          className="nav__ig"
          href={instagramLink()}
          target="_blank"
          rel="noreferrer"
          aria-label={`${header.instagram} @${brand.instagramUser}`}
        >
          <InstagramIcon />
          <span className="nav__ig-label">{header.instagram}</span>
        </a>
        <a
          className="btn btn--light btn--small nav__cta"
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          {header.cta}
        </a>
      </nav>

      <button
        type="button"
        className="btn btn--line btn--small menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="menu-principal"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "Fechar" : "Menu"}
      </button>
    </header>
  );
}
