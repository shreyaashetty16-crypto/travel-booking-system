export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="state-block state-loading" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
