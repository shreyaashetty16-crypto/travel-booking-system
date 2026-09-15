import { useState } from 'react';
import { recommendationApi } from '../../api/recommendationApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import SuccessMessage from '../../components/common/SuccessMessage';

export default function RecommendationsPage() {
  return (
    <div>
      <p
        className="notice-badge"
        style={{ display: 'inline-block', marginBottom: 'var(--space-4)', background: 'var(--color-bg)', color: 'var(--color-ink-soft)' }}
      >
        Rule-based recommendation logic — not machine learning or AI.
      </p>
      <GeneralRecommendationPanel />
      <PersonalizedRecommendationPanel />
      <HistoryBasedRecommendationPanel />
      <CollaborativeRecommendationPanel />
      <RecommendationHistoryPanel />
      <UserPreferencesPanel />
    </div>
  );
}

function RecommendationResult({ result }) {
  if (!result) return null;
  return (
    <table className="data-table">
      <tbody>
        <tr>
          <th>Destination</th>
          <td>
            <strong>{result.destination}</strong>
          </td>
        </tr>
        <tr>
          <th>Recommendation</th>
          <td>{result.recommendation}</td>
        </tr>
        <tr>
          <th>Reason</th>
          <td>{result.reason}</td>
        </tr>
        <tr>
          <th>Budget considered</th>
          <td>₹{result.budget}</td>
        </tr>
      </tbody>
    </table>
  );
}

/* ---------------------------------------------------------------------- */
/* 1. General recommendation                                               */
/* ---------------------------------------------------------------------- */
const PREFERENCE_OPTIONS = ['general', 'beach', 'mountain', 'city'];

function GeneralRecommendationPanel() {
  const [budget, setBudget] = useState('');
  const [preference, setPreference] = useState('general');
  const [customPreference, setCustomPreference] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!budget) {
      setError('Enter a budget.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const chosenPreference = useCustom ? customPreference : preference;
      const data = await recommendationApi.getGeneral(Number(budget), chosenPreference);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">General recommendation</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        Budget alone picks between Mysore / Goa / Kashmir. A preference of beach, mountain, or
        city overrides that. Anything else you type is used directly as the destination — try
        typing a place name as a "custom" preference.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="genBudget">Budget (₹)</label>
            <input id="genBudget" type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="20000" />
          </div>
          <div className="field">
            <label htmlFor="genPreference">Preference</label>
            <select
              id="genPreference"
              value={useCustom ? '__custom__' : preference}
              onChange={(e) => {
                if (e.target.value === '__custom__') {
                  setUseCustom(true);
                } else {
                  setUseCustom(false);
                  setPreference(e.target.value);
                }
              }}
            >
              {PREFERENCE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
              <option value="__custom__">Custom…</option>
            </select>
          </div>
          {useCustom && (
            <div className="field">
              <label htmlFor="genCustomPreference">Custom preference / destination</label>
              <input
                id="genCustomPreference"
                value={customPreference}
                onChange={(e) => setCustomPreference(e.target.value)}
                placeholder="e.g. Paris"
              />
            </div>
          )}
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Getting recommendation…' : 'Get recommendation'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Getting recommendation…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && <RecommendationResult result={result} />}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Shared shape for the next 3 panels (userName + budget → recommendation) */
/* ---------------------------------------------------------------------- */
function UserBudgetRecommendationPanel({ title, hint, fetcher, buttonLabel }) {
  const [userName, setUserName] = useState('');
  const [budget, setBudget] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userName || !budget) {
      setError('Enter both a username and a budget.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await fetcher(userName, Number(budget));
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">{title}</h2>
      {hint && (
        <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>{hint}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>User name</label>
            <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Priya" />
          </div>
          <div className="field">
            <label>Budget (₹)</label>
            <input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="20000" />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Loading…' : buttonLabel}
        </button>
      </form>
      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Getting recommendation…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && <RecommendationResult result={result} />}
      </div>
    </section>
  );
}

function PersonalizedRecommendationPanel() {
  return (
    <UserBudgetRecommendationPanel
      title="Personalized recommendation"
      hint="Uses this user's saved preferred destination (see User preferences below). Falls back to the general budget recommendation if no preference is saved."
      fetcher={recommendationApi.getPersonalized}
      buttonLabel="Get personalized recommendation"
    />
  );
}

function HistoryBasedRecommendationPanel() {
  return (
    <UserBudgetRecommendationPanel
      title="History-based recommendation"
      hint="Looks at this user's saved recommendation history (see below) and picks the most recent destination. Falls back to the budget recommendation if there's no history yet."
      fetcher={recommendationApi.getHistoryBased}
      buttonLabel="Get history-based recommendation"
    />
  );
}

function CollaborativeRecommendationPanel() {
  return (
    <UserBudgetRecommendationPanel
      title="Collaborative-style recommendation"
      hint='A simplified, rule-based approach: it prefers a past destination the user marked "liked" or "helpful", otherwise falls back to their most recent history, otherwise the budget recommendation.'
      fetcher={recommendationApi.getCollaborative}
      buttonLabel="Get collaborative recommendation"
    />
  );
}

/* ---------------------------------------------------------------------- */
/* 5. Recommendation history + feedback                                    */
/* ---------------------------------------------------------------------- */
function RecommendationHistoryPanel() {
  const [userName, setUserName] = useState('');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('');
  const [saveBudget, setSaveBudget] = useState('');
  const [interaction, setInteraction] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [feedbackBusyId, setFeedbackBusyId] = useState(null);

  async function loadHistory(e) {
    if (e) e.preventDefault();
    if (!userName) return;
    setLoading(true);
    setError(null);
    setLoaded(true);
    try {
      const data = await recommendationApi.getHistory(userName);
      setHistory(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveHistory(e) {
    e.preventDefault();
    setSaveError(null);
    setNotice(null);

    if (!userName || !destination || !category || !saveBudget || !interaction) {
      setSaveError('Username, destination, category, budget, and interaction are all required.');
      return;
    }

    setSaving(true);
    try {
      await recommendationApi.saveHistory(userName, destination, category, Number(saveBudget), interaction);
      setNotice('History entry saved.');
      setDestination('');
      setCategory('');
      setSaveBudget('');
      setInteraction('');
      await loadHistory();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleFeedback(id, newInteraction) {
    setFeedbackBusyId(id);
    setNotice(null);
    try {
      await recommendationApi.updateFeedback(id, newInteraction);
      setNotice(`Feedback updated to "${newInteraction}" for entry ${id}.`);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setFeedbackBusyId(null);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Recommendation history &amp; feedback</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        This is the same history used by the history-based and collaborative recommendations
        above — saving an entry here with interaction "liked" will influence those results.
      </p>

      <form onSubmit={loadHistory} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', marginBottom: 'var(--space-4)' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="histUserName">User name</label>
          <input id="histUserName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Priya" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Load history'}
        </button>
      </form>

      {loading && <LoadingState label="Loading history…" />}
      {!loading && error && <ErrorState message={error} onRetry={loadHistory} />}
      {!loading && !error && loaded && history && history.length === 0 && (
        <EmptyState title="No history for this user yet" hint="Save an entry using the form below." />
      )}
      {!loading && !error && history && history.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Destination</th>
              <th>Category</th>
              <th>Budget</th>
              <th>Interaction</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td>
                  <code>{h.id}</code>
                </td>
                <td>{h.destination}</td>
                <td>{h.category}</td>
                <td>₹{h.budget}</td>
                <td>{h.interaction}</td>
                <td style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => handleFeedback(h.id, 'liked')}
                    disabled={feedbackBusyId === h.id}
                  >
                    👍 Liked
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => handleFeedback(h.id, 'disliked')}
                    disabled={feedbackBusyId === h.id}
                  >
                    👎 Disliked
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="panel" style={{ background: 'var(--color-bg)', marginBottom: 0, marginTop: 'var(--space-4)' }}>
        <div className="panel-title" style={{ fontSize: 'var(--text-sm)' }}>
          Save a history entry
        </div>
        <form onSubmit={handleSaveHistory}>
          <div className="form-grid">
            <div className="field">
              <label>Destination</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Goa" />
            </div>
            <div className="field">
              <label>Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="beach" />
            </div>
            <div className="field">
              <label>Budget (₹)</label>
              <input type="number" min="0" value={saveBudget} onChange={(e) => setSaveBudget(e.target.value)} placeholder="20000" />
            </div>
            <div className="field">
              <label>Interaction</label>
              <input value={interaction} onChange={(e) => setInteraction(e.target.value)} placeholder="liked / viewed / disliked" />
            </div>
          </div>
          <button className="btn btn-accent" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save history entry'}
          </button>
        </form>
        {saveError && <ErrorState message={saveError} />}
        <SuccessMessage message={notice} />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* 6. User preferences                                                     */
/* ---------------------------------------------------------------------- */
function UserPreferencesPanel() {
  const [userName, setUserName] = useState('');
  const [preference, setPreference] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [preferredSeat, setPreferredSeat] = useState('');
  const [preferredRoom, setPreferredRoom] = useState('');
  const [preferredDestination, setPreferredDestination] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadPreference(e) {
    if (e) e.preventDefault();
    if (!userName) return;
    setLoading(true);
    setError(null);
    setLoaded(true);
    setNotice(null);
    try {
      const data = await recommendationApi.getPreference(userName);
      setPreference(data);
      if (data) {
        setPreferredSeat(data.preferredSeat || '');
        setPreferredRoom(data.preferredRoom || '');
        setPreferredDestination(data.preferredDestination || '');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveError(null);
    setNotice(null);

    if (!userName) {
      setSaveError('Enter a username first.');
      return;
    }

    setSaving(true);
    try {
      const body = { userName, preferredSeat, preferredRoom, preferredDestination };
      // Use update if a preference already exists for this user, add otherwise.
      const saved = preference
        ? await recommendationApi.updatePreference(userName, body)
        : await recommendationApi.savePreference(body);
      setPreference(saved);
      setNotice(`Preferences saved for ${userName}.`);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!userName) return;
    setDeleting(true);
    setNotice(null);
    try {
      const message = await recommendationApi.deletePreference(userName);
      setNotice(message || 'Preference deleted.');
      setPreference(null);
      setPreferredSeat('');
      setPreferredRoom('');
      setPreferredDestination('');
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">
        User preferences
        <span className="notice-badge">In-memory — resets on backend restart</span>
      </h2>

      <form onSubmit={loadPreference} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', marginBottom: 'var(--space-4)' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="prefUserName">User name</label>
          <input id="prefUserName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Priya" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Load preferences'}
        </button>
      </form>

      {loading && <LoadingState label="Loading preferences…" />}
      {!loading && error && <ErrorState message={error} onRetry={loadPreference} />}
      {!loading && !error && loaded && !preference && (
        <EmptyState title="No saved preferences for this user" hint="Fill in the form below to add some." />
      )}

      <form onSubmit={handleSave}>
        <div className="form-grid">
          <div className="field">
            <label>Preferred seat</label>
            <input value={preferredSeat} onChange={(e) => setPreferredSeat(e.target.value)} placeholder="1A" />
          </div>
          <div className="field">
            <label>Preferred room</label>
            <input value={preferredRoom} onChange={(e) => setPreferredRoom(e.target.value)} placeholder="102" />
          </div>
          <div className="field">
            <label>Preferred destination</label>
            <input
              value={preferredDestination}
              onChange={(e) => setPreferredDestination(e.target.value)}
              placeholder="Goa"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : preference ? 'Update preferences' : 'Save preferences'}
          </button>
          <button className="btn btn-danger" type="button" onClick={handleDelete} disabled={deleting || !userName}>
            {deleting ? 'Deleting…' : 'Delete preferences'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 'var(--space-3)' }}>
        {saveError && <ErrorState message={saveError} />}
        <SuccessMessage message={notice} />
      </div>
    </section>
  );
}
