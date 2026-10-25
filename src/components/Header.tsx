import { useEffect, useState } from "react";
import { nav } from "../content";
import BrandMark from "./BrandMark";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

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

  return (
    <header className="site-header" data-solid={solid} data-menu={menuOpen}>
      <a className="brand" href="#inicio" aria-label="Rose & Keise, ir para o início" onClick={() => setMenuOpen(false)}>
        <BrandMark />
      </a>

      <nav className="nav" id="menu-principal" aria-label="Principal">
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
