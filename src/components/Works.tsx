import { brand, products, worksSection } from "../content";
import { instagramLink } from "../lib/links";
import WorksCarousel from "./WorksCarousel";

export default function Works() {
  return (
    <section className="gallery" id="trabalhos">
      <div className="gallery__inner">
        <div className="gallery__head">
          <h2>{worksSection.title}</h2>
          <p>{worksSection.text}</p>
          <a className="gallery__instagram" href={instagramLink()} target="_blank" rel="noreferrer">
            {worksSection.instagramCta} @{brand.instagramUser}
          </a>
        </div>

        <div className="gallery__products">
          <h3 className="gallery__subtitle">{worksSection.productsTitle}</h3>
          <dl className="gallery__list">
            {products.map((product) => (
              <div key={product.name}>
                <dt>{product.name}</dt>
                <dd>{product.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <WorksCarousel />
      </div>
    </section>
  );
}
