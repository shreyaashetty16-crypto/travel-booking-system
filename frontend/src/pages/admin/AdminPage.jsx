import { useState } from 'react';
import { adminApi } from '../../api/adminApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import SuccessMessage from '../../components/common/SuccessMessage';

export default function AdminPage() {
  return (
    <div>
      <p
        className="notice-badge"
        style={{ display: 'inline-block', marginBottom: 'var(--space-4)', background: 'var(--color-bg)', color: 'var(--color-ink-soft)' }}
      >
        Existing backend's basic admin moderation — plain username/password check, no JWT or session tokens.
      </p>
      <AdminRegisterPanel />
      <AdminLoginPanel />
      <ReviewModerationPanel />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* A. Admin registration                                                   */
/* ---------------------------------------------------------------------- */
function AdminRegisterPanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    setSaving(true);
    try {
      const saved = await adminApi.register({ username, password });
      setSuccess(`Admin "${saved.username}" registered (ID ${saved.id}).`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Admin registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="regUsername">Username</label>
            <input id="regUsername" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </div>
          <div className="field">
            <label htmlFor="regPassword">Password</label>
            <input
              id="regPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Registering…' : 'Register admin'}
        </button>
      </form>

      {error && <ErrorState message={error} />}
      <SuccessMessage message={success} />
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* B. Admin login                                                           */
/* ---------------------------------------------------------------------- */
function AdminLoginPanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    setChecking(true);
    try {
      const message = await adminApi.login({ username, password });
      setResult(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  }

  const loggedIn = result === 'Login Successful';

  return (
    <section className="panel">
      <h2 className="panel-title">Admin login</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        This checks the username/password against the database and shows the backend's plain-text
        result below — it does not create a real login session or token.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="loginUsername">Username</label>
            <input id="loginUsername" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </div>
          <div className="field">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={checking}>
          {checking ? 'Checking…' : 'Log in'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-3)' }}>
        {error && <ErrorState message={error} />}
        {result && (loggedIn ? <SuccessMessage message={result} /> : <ErrorState message={result} />)}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* C. Review moderation                                                    */
/* ---------------------------------------------------------------------- */
function ReviewModerationPanel() {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  async function loadReviews() {
    setLoading(true);
    setError(null);
    setLoaded(true);
    try {
      const data = await adminApi.getAllReviews();
      setReviews(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setNotice(null);
    try {
      const message = await adminApi.deleteReview(id);
      setNotice(message || `Review ${id} deleted.`);
      await loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="panel-title" style={{ marginBottom: 0 }}>
          Review moderation
        </h2>
        <button className="btn btn-ghost" onClick={loadReviews} disabled={loading}>
          {loaded ? 'Refresh' : 'Load reviews'}
        </button>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Loading reviews…" />}
        {!loading && error && <ErrorState message={error} onRetry={loadReviews} />}
        {!loading && !error && loaded && reviews && reviews.length === 0 && (
          <EmptyState title="No reviews to moderate" />
        )}
        {!loading && !error && reviews && reviews.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Booking</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    <code>{r.id}</code>
                  </td>
                  <td>{r.userName}</td>
                  <td>
                    <code>{r.bookingId}</code>
                  </td>
                  <td>{r.rating} / 5</td>
                  <td>{r.comment}</td>
                  <td>{r.status}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(r.id)}
                      disabled={deletingId === r.id}
                    >
                      {deletingId === r.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SuccessMessage message={notice} />
    </section>
  );
}
