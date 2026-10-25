import { brand, contact } from "../content";
import { instagramLink, mapsDirectionsLink, mapsEmbedLink, mapsLink, whatsappLink } from "../lib/links";

export default function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="contact__inner">
        <div className="contact__text">
          <h2>{contact.title}</h2>
          <p>{contact.text}</p>
          <div className="contact__actions">
            <a className="btn btn--light" href={whatsappLink()} target="_blank" rel="noreferrer">
              {contact.cta}
            </a>
            <a className="btn btn--line" href={instagramLink()} target="_blank" rel="noreferrer">
              {contact.instagramCta}
            </a>
          </div>

          <dl className="contact__info">
            <div>
              <dt>{contact.labels.whatsapp}</dt>
              <dd>
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  {brand.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt>{contact.labels.instagram}</dt>
              <dd>
                <a href={instagramLink()} target="_blank" rel="noreferrer">
                  @{brand.instagramUser}
                </a>
              </dd>
            </div>
            <div>
              <dt>{contact.labels.address}</dt>
              <dd>
                <a href={mapsLink()} target="_blank" rel="noreferrer">
                  {brand.street}
                  <span className="contact__line">
                    {brand.district}, {brand.city}
                  </span>
                </a>
              </dd>
            </div>
            {brand.hours.length > 0 && (
              <div>
                <dt>{contact.labels.hours}</dt>
                <dd>
                  {brand.hours.map((h) => (
                    <span key={h.days} className="contact__line">
                      {h.days}: {h.time}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="contact__map">
          <div className="map">
            <div className="map__fallback" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>
                {brand.street}, {brand.district}
              </span>
            </div>
            <iframe
              title={contact.mapTitle}
              src={mapsEmbedLink()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="contact__map-actions">
            <a className="btn btn--light" href={mapsDirectionsLink()} target="_blank" rel="noreferrer">
              {contact.directionsCta}
            </a>
            <a className="btn btn--line" href={mapsLink()} target="_blank" rel="noreferrer">
              {contact.mapsCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
