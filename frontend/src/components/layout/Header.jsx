import { useBackendStatus } from '../../api/useBackendStatus';

export default function Header({ title }) {
  const status = useBackendStatus();

  const pillLabel =
    status === 'checking' ? 'Checking backend…' : status === 'online' ? 'Backend connected' : 'Backend unreachable';

  const pillStyle =
    status === 'offline'
      ? { background: 'var(--color-error-bg)', color: 'var(--color-error)' }
      : status === 'checking'
        ? { background: 'rgba(91,100,120,0.1)', color: 'var(--color-ink-soft)' }
        : undefined; // default success styling from CSS

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-meta">
        <span className="topbar-pill" style={pillStyle}>
          <span className="dot" style={status === 'offline' ? { background: 'var(--color-error)' } : undefined} />
          {pillLabel}
        </span>
      </div>
    </header>
  );
}
