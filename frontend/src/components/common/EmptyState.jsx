export default function EmptyState({ title = 'Nothing here yet', hint }) {
  return (
    <div className="state-block state-empty">
      <div className="state-empty-title">{title}</div>
      {hint && <div>{hint}</div>}
    </div>
  );
}
