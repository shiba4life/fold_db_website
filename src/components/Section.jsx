export default function Section({ variant, id, children }) {
  return (
    <div className={`section-${variant}`} id={id}>
      {children}
    </div>
  );
}
