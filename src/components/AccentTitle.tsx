// Título com a última palavra em itálico dourado (detalhe de estilo dos títulos das seções).
export default function AccentTitle({ text }: { text: string }) {
  const cut = text.lastIndexOf(" ");
  if (cut < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, cut)} <em>{text.slice(cut + 1)}</em>
    </>
  );
}
