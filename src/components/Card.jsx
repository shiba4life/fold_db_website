export default function Card({ children, className, style, onClick }) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
