import { about } from "../content";

export default function About() {
  return (
    <section className="about" id="sobre">
      <div className="about__inner">
        <div className="about__text">
          <h2>{about.title}</h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
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
