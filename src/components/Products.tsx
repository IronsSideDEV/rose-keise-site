import { products, productsSection } from "../content";
import WorksCarousel from "./WorksCarousel";

export default function Products() {
  return (
    <section className="products" id="produtos">
      <div className="products__inner">
        <div className="products__head">
          <h2>{productsSection.title}</h2>
          <p>{productsSection.text}</p>
        </div>

        <dl className="products__list">
          {products.map((product) => (
            <div key={product.name}>
              <dt>{product.name}</dt>
              <dd>{product.description}</dd>
            </div>
          ))}
        </dl>

        <WorksCarousel />
      </div>
    </section>
  );
}
