import { brand, footer, nav } from "../content";
import { instagramLink, mapsLink, whatsappLink } from "../lib/links";
import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a className="brand" href="#inicio" aria-label={`${brand.name} ${brand.kind}, voltar ao topo`}>
            <BrandMark />
          </a>
          <p>
            {brand.kind} no {brand.district}, {brand.city}.
          </p>
        </div>

        <nav className="footer__col" aria-label="Rodapé">
          <p className="footer__title">{footer.navTitle}</p>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <p className="footer__title">{footer.contactTitle}</p>
          <ul>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                {brand.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={instagramLink()} target="_blank" rel="noreferrer">
                @{brand.instagramUser}
              </a>
            </li>
            <li>
              <a href={mapsLink()} target="_blank" rel="noreferrer">
                {brand.street}
                <br />
                {brand.district}, {brand.city}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="footer__legal">
        © {new Date().getFullYear()} {brand.name} {brand.kind}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
