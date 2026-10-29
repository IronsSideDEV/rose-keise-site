import { notice } from "../content";
import Divider from "./Divider";
import Ornament from "./Ornament";

export default function Notice() {
  return (
    <section className="notice" id="comunicado">
      <Ornament side="left" />
      <Ornament side="right" />
      <div className="notice__inner">
        <h2>{notice.title}</h2>
        <Divider />
        <ol className="notice__list">
          {notice.items.map((item, index) => (
            <li key={item.title} className="notice__item">
              <span className="notice__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
