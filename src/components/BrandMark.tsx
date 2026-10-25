import { brand } from "../content";

// Nome em dourado laminado com profundidade 3D (estilos em .brand no styles.css).
export default function BrandMark() {
  return (
    <>
      <span className="brand__depth" aria-hidden="true">
        {brand.name}
      </span>
      <span className="brand__face">{brand.name}</span>
    </>
  );
}
