import { useEffect, useState } from 'react';
import { cancellationApi } from '../../api/cancellationApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import SuccessMessage from '../../components/common/SuccessMessage';

export default function CancellationPage() {
  // Reasons are fetched once here and shared by the reasons list (section B)
  // and the cancel-flight dropdown (section A), so we don't call the same
  // endpoint twice.
  const [reasons, setReasons] = useState(null);
  const [reasonsLoading, setReasonsLoading] = useState(true);
  const [reasonsError, setReasonsError] = useState(null);

  async function loadReasons() {
    setReasonsLoading(true);
    setReasonsError(null);
    try {
      const data = await cancellationApi.getReasons();
      setReasons(data?.reasons || []);
    } catch (err) {
      setReasonsError(err.message);
    } finally {
      setReasonsLoading(false);
    }
  }

  useEffect(() => {
    loadReasons();
  }, []);

  return (
    <div>
      <CancellationReasonsPanel reasons={reasons} loading={reasonsLoading} error={reasonsError} onRetry={loadReasons} />
      <CancelFlightPanel reasons={reasons} />
      <AllCancellationsPanel />
      <RefundDetailsPanel />
      <RefundStatusPanel />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* B. Cancellation reasons                                                 */
/* ---------------------------------------------------------------------- */
function CancellationReasonsPanel({ reasons, loading, error, onRetry }) {
  return (
    <section className="panel">
      <h2 className="panel-title">Cancellation reasons</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        Loaded from the backend — used to populate the reason dropdown below.
      </p>

      {loading && <LoadingState label="Loading reasons…" />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && reasons && reasons.length === 0 && (
        <EmptyState title="No reasons returned by the backend" />
      )}
      {!loading && !error && reasons && reasons.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {reasons.map((r) => (
            <span key={r} className="notice-badge" style={{ background: 'var(--color-bg)', color: 'var(--color-ink-soft)' }}>
              {r}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* A. Cancel a flight                                                      */
/* ---------------------------------------------------------------------- */
function CancelFlightPanel({ reasons }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [bookingAmount, setBookingAmount] = useState('');
  const [reason, setReason] = useState('');
  const [within24Hours, setWithin24Hours] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!flightNumber || !bookingAmount || !reason) {
      setError('Flight number, booking amount, and a reason are all required.');
      return;
    }

    setSaving(true);
    try {
      const data = await cancellationApi.cancelFlight(
        flightNumber,
        Number(bookingAmount),
        reason,
        within24Hours
      );
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Cancel a flight</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        The refund percentage is calculated by the existing backend rules (100% within 24 hours,
        or for Medical/Flight Cancelled reasons; 50% for Personal; 25% otherwise). This does not
        process a real payment refund — it's the existing internship simulation.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="cancelFlightNumber">Flight number</label>
            <input
              id="cancelFlightNumber"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="AI101"
            />
          </div>
          <div className="field">
            <label htmlFor="bookingAmount">Booking amount (₹)</label>
            <input
              id="bookingAmount"
              type="number"
              min="0"
              step="1"
              value={bookingAmount}
              onChange={(e) => setBookingAmount(e.target.value)}
              placeholder="5000"
            />
          </div>
          <div className="field">
            <label htmlFor="reason">Reason</label>
            {reasons && reasons.length > 0 ? (
              <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="">Select a reason…</option>
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Personal"
              />
            )}
          </div>
          <div className="field" style={{ justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ink)' }}>
              <input
                type="checkbox"
                checked={within24Hours}
                onChange={(e) => setWithin24Hours(e.target.checked)}
                style={{ width: 'auto' }}
              />
              Cancelled within 24 hours of booking
            </label>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Cancelling…' : 'Cancel flight'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {error && <ErrorState message={error} />}
        {result && (
          <>
            <SuccessMessage message={`Cancellation recorded for ${result.flightNumber}.`} />
            <table className="data-table">
              <tbody>
                <tr>
                  <th>Booking amount</th>
                  <td>₹{result.bookingAmount}</td>
                </tr>
                <tr>
                  <th>Refund percentage</th>
                  <td>{result.refundPercentage}%</td>
                </tr>
                <tr>
                  <th>Refund amount</th>
                  <td>
                    <strong>₹{result.refundAmount}</strong>
                  </td>
                </tr>
                <tr>
                  <th>Reason</th>
                  <td>{result.reason}</td>
                </tr>
                <tr>
                  <th>Cancelled within 24 hours</th>
                  <td>{result.cancelledWithin24Hours ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <th>Refund status</th>
                  <td>{result.refundStatus}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* C. All cancellations                                                    */
/* ---------------------------------------------------------------------- */
function AllCancellationsPanel() {
  const [cancellations, setCancellations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    setLoaded(true);
    try {
      // Backend returns a map keyed by flight number, not an array.
      const data = await cancellationApi.getAllCancellations();
      setCancellations(data || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const entries = cancellations ? Object.entries(cancellations) : [];

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="panel-title" style={{ marginBottom: 0 }}>
          All cancellations
        </h2>
        <button className="btn btn-ghost" onClick={loadAll} disabled={loading}>
          {loaded ? 'Refresh' : 'Load cancellations'}
        </button>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Loading cancellations…" />}
        {!loading && error && <ErrorState message={error} onRetry={loadAll} />}
        {!loading && !error && loaded && entries.length === 0 && (
          <EmptyState title="No cancellations recorded yet" hint="Cancel a flight above, then load again." />
        )}
        {!loading && !error && entries.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Flight number</th>
                <th>Booking amount</th>
                <th>Refund %</th>
                <th>Refund amount</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([flightNumber, c]) => (
                <tr key={flightNumber}>
                  <td>
                    <code>{flightNumber}</code>
                  </td>
                  <td>₹{c.bookingAmount}</td>
                  <td>{c.refundPercentage}%</td>
                  <td>₹{c.refundAmount}</td>
                  <td>{c.reason}</td>
                  <td>{c.refundStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* D. Refund details (from the cancellation record itself)                 */
/* ---------------------------------------------------------------------- */
function RefundDetailsPanel() {
  const [flightNumber, setFlightNumber] = useState('');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleFetch(e) {
    e.preventDefault();
    if (!flightNumber) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await cancellationApi.getRefundDetails(flightNumber);
      setDetails(data);
    } catch (err) {
      setDetails(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Refund details</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        This reads the actual cancellation record for the flight, so it will only return data for
        a flight number that has been cancelled using the form above.
      </p>

      <form onSubmit={handleFetch} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="refundDetailsFlightNumber">Flight number</label>
          <input
            id="refundDetailsFlightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="AI101"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Fetching…' : 'Get refund details'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Fetching refund details…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && searched && !details && (
          <EmptyState
            title="No cancellation found for this flight"
            hint="Cancel this flight number above first, then try again."
          />
        )}
        {!loading && !error && details && (
          <table className="data-table">
            <tbody>
              <tr>
                <th>Flight number</th>
                <td>
                  <code>{details.flightNumber}</code>
                </td>
              </tr>
              <tr>
                <th>Booking amount</th>
                <td>₹{details.bookingAmount}</td>
              </tr>
              <tr>
                <th>Refund percentage</th>
                <td>{details.refundPercentage}%</td>
              </tr>
              <tr>
                <th>Refund amount</th>
                <td>
                  <strong>₹{details.refundAmount}</strong>
                </td>
              </tr>
              <tr>
                <th>Reason</th>
                <td>{details.reason}</td>
              </tr>
              <tr>
                <th>Refund status</th>
                <td>{details.refundStatus}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* E. Refund status (separate tracker) + update                            */
/* ---------------------------------------------------------------------- */
const SUGGESTED_STATUSES = ['Pending', 'Processing', 'Approved', 'Rejected', 'Completed'];

function RefundStatusPanel() {
  const [flightNumber, setFlightNumber] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const [newStatus, setNewStatus] = useState('');
  const [useCustomStatus, setUseCustomStatus] = useState(false);
  const [customStatus, setCustomStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  async function handleCheck(e) {
    e.preventDefault();
    if (!flightNumber) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    setUpdateSuccess(null);
    try {
      const data = await cancellationApi.getRefundStatus(flightNumber);
      setStatus(data);
    } catch (err) {
      setStatus(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    const statusToSend = useCustomStatus ? customStatus : newStatus;
    if (!flightNumber) {
      setUpdateError('Enter a flight number above first.');
      return;
    }
    if (!statusToSend) {
      setUpdateError('Choose or enter a status to set.');
      return;
    }

    setUpdateError(null);
    setUpdateSuccess(null);
    setUpdating(true);
    try {
      const data = await cancellationApi.updateRefundStatus(flightNumber, statusToSend);
      setStatus(data);
      setUpdateSuccess(`Refund status for ${data.flightNumber} updated to "${data.refundStatus}".`);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">
        Refund status
        <span className="notice-badge">In-memory — resets on backend restart</span>
      </h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        This is a separate status tracker from the refund details above. Checking it for the
        first time initializes it to "Pending", even if that flight was never cancelled — that's
        the existing backend behavior, not a bug in this UI.
      </p>

      <form onSubmit={handleCheck} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="refundStatusFlightNumber">Flight number</label>
          <input
            id="refundStatusFlightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="AI101"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Checking…' : 'Check refund status'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Checking refund status…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && status && (
          <table className="data-table">
            <tbody>
              <tr>
                <th>Flight number</th>
                <td>
                  <code>{status.flightNumber}</code>
                </td>
              </tr>
              <tr>
                <th>Refund status</th>
                <td>
                  <strong>{status.refundStatus}</strong>
                </td>
              </tr>
              <tr>
                <th>Expected time</th>
                <td>{status.expectedTime}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="panel" style={{ background: 'var(--color-bg)', marginBottom: 0, marginTop: 'var(--space-4)' }}>
        <div className="panel-title" style={{ fontSize: 'var(--text-sm)' }}>
          Update refund status
        </div>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-xs)', marginTop: 0 }}>
          The backend accepts any status text — these are suggested values, not an enforced list.
        </p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="newStatus">New status</label>
            <select
              id="newStatus"
              value={useCustomStatus ? '__custom__' : newStatus}
              onChange={(e) => {
                if (e.target.value === '__custom__') {
                  setUseCustomStatus(true);
                } else {
                  setUseCustomStatus(false);
                  setNewStatus(e.target.value);
                }
              }}
            >
              <option value="">Select a status…</option>
              {SUGGESTED_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="__custom__">Custom…</option>
            </select>
          </div>

          {useCustomStatus && (
            <div className="field">
              <label htmlFor="customStatus">Custom status text</label>
              <input
                id="customStatus"
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value)}
                placeholder="e.g. Escalated"
              />
            </div>
          )}
        </div>

        <button className="btn btn-accent" type="button" onClick={handleUpdate} disabled={updating}>
          {updating ? 'Updating…' : 'Update status'}
        </button>

        <div style={{ marginTop: 'var(--space-3)' }}>
          {updateError && <ErrorState message={updateError} />}
          <SuccessMessage message={updateSuccess} />
        </div>
      </div>
    </section>
  );
}
