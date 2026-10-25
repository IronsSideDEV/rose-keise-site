import { useState } from "react";
import { services, servicesSection } from "../content";

export default function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="services" id="servicos">
      <div className="services__inner">
        <div className="services__intro">
          <h2>{servicesSection.title}</h2>
        </div>

        <ul className="services__list">
          {services.map((service, i) => {
            const isOpen = open === i;
            return (
              <li key={service.name} className="svc">
                <h3>
                  <button
                    type="button"
                    className="svc__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`servico-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{service.name}</span>
                    <span className="svc__meta">
                      {service.price && <span className="svc__price">{service.price}</span>}
                      <span className="svc__icon" aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                <div id={`servico-${i}`} className="svc__panel" data-open={isOpen} inert={!isOpen}>
                  <div>
                    <p>{service.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
