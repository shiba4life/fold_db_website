export default function Label({ color, children }) {
  return <span className={`label label-${color}`}>{children}</span>;
}
