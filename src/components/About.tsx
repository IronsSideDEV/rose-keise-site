import { about, brand } from "../content";
import { instagramLink, whatsappLink } from "../lib/links";
import AccentTitle from "./AccentTitle";
import InstagramIcon from "./InstagramIcon";
import Ornament from "./Ornament";

export default function About() {
  return (
    <section className="about" id="sobre">
      <Ornament side="left" />
      <Ornament side="right" />
      <div className="about__inner">
        <div className="about__text">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2>
            <AccentTitle text={about.title} />
          </h2>
          <span className="about__rule" aria-hidden="true" />
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="about__actions">
            <a className="btn btn--dark" href={whatsappLink()} target="_blank" rel="noreferrer">
              {about.cta}
            </a>
            <a className="btn btn--outline" href={instagramLink()} target="_blank" rel="noreferrer">
              <InstagramIcon />
              {about.instagramCta}
            </a>
          </div>
          <p className="about__address">
            {brand.street} · {brand.district}
          </p>
        </div>

        <figure className="about__media">
          <div className="about__nail">
            <div className="about__photo">
              <img
                src={`${import.meta.env.BASE_URL}images/fachada.webp`}
                alt={about.imageAlt}
                width={1046}
                height={1054}
                loading="lazy"
              />
            </div>
          </div>
          <figcaption>{about.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
