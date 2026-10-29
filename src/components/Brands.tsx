import { brandsSection } from "../content";
import { whatsappLink } from "../lib/links";
import AccentTitle from "./AccentTitle";
import Divider from "./Divider";
import Ornament from "./Ornament";

export default function Brands() {
  return (
    <section className="brands" id="marcas">
      <Ornament side="left" />
      <Ornament side="right" />
      <div className="brands__inner">
        <h2>
          <AccentTitle text={brandsSection.title} />
        </h2>
        <Divider />
        <p>{brandsSection.text}</p>
        <ul className="brands__list">
          {brandsSection.list.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <a
          className="btn btn--dark brands__cta"
          href={whatsappLink(brandsSection.message)}
          target="_blank"
          rel="noreferrer"
        >
          {brandsSection.cta}
        </a>
      </div>
    </section>
  );
}
