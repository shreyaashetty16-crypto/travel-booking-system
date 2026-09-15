export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-block state-error" role="alert">
      <div style={{ flex: 1 }}>
        <div>{message || 'Something went wrong.'}</div>
        {onRetry && (
          <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
