import { servicesSection } from "../content";
import AccentTitle from "./AccentTitle";
import Divider from "./Divider";
import Ornament from "./Ornament";

export default function Services() {
  return (
    <section className="services" id="servicos">
      <Ornament side="left" />
      <Ornament side="right" />
      <div className="services__inner">
        <h2>
          <AccentTitle text={servicesSection.title} />
        </h2>
        <Divider />
        <p>{servicesSection.text}</p>
      </div>
    </section>
  );
}
