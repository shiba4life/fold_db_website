export default function Card({ children, className, style, onClick, role, tabIndex, onKeyDown }) {
  return (
    <div
      className={`card${className ? ` ${className}` : ''}`}
      style={style}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
