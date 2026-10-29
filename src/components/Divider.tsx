// Filete com um ponto no meio, usado abaixo dos títulos das seções claras.
export default function Divider() {
  return (
    <span className="divider" aria-hidden="true">
      <span className="divider__dot" />
    </span>
  );
}
