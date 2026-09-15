export default function SuccessMessage({ message }) {
  if (!message) return null;
  return (
    <div
      className="state-block"
      style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', border: '1px solid rgba(63,143,107,0.25)' }}
      role="status"
    >
      {message}
    </div>
  );
}
