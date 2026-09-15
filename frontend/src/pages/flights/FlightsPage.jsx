import { useEffect, useState } from 'react';
import { flightApi } from '../../api/flightApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import SuccessMessage from '../../components/common/SuccessMessage';

const EMPTY_FORM = {
  flightNumber: '',
  airline: '',
  departure: '',
  arrival: '',
  delayReason: '',
  estimatedArrivalTime: '',
};

export default function FlightsPage() {
  return (
    <div>
      <AddFlightPanel />
      <AllFlightsPanel />
      <FlightByIdPanel />
      <FlightStatusPanel />
      <FlightNotificationPanel />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 1. Add a flight                                                         */
/* ---------------------------------------------------------------------- */
function AddFlightPanel() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.flightNumber || !form.airline || !form.departure || !form.arrival) {
      setError('Flight number, airline, departure, and arrival are required.');
      return;
    }

    setSaving(true);
    try {
      const saved = await flightApi.addFlight(form);
      setSuccess(`Flight ${saved.flightNumber} was added with ID ${saved.id}.`);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Add a flight</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="flightNumber">Flight number</label>
            <input
              id="flightNumber"
              value={form.flightNumber}
              onChange={(e) => updateField('flightNumber', e.target.value)}
              placeholder="AI101"
            />
          </div>
          <div className="field">
            <label htmlFor="airline">Airline</label>
            <input
              id="airline"
              value={form.airline}
              onChange={(e) => updateField('airline', e.target.value)}
              placeholder="Air India"
            />
          </div>
          <div className="field">
            <label htmlFor="departure">Departure</label>
            <input
              id="departure"
              value={form.departure}
              onChange={(e) => updateField('departure', e.target.value)}
              placeholder="Bengaluru"
            />
          </div>
          <div className="field">
            <label htmlFor="arrival">Arrival</label>
            <input
              id="arrival"
              value={form.arrival}
              onChange={(e) => updateField('arrival', e.target.value)}
              placeholder="Delhi"
            />
          </div>
          <div className="field">
            <label htmlFor="delayReason">Delay reason (optional)</label>
            <input
              id="delayReason"
              value={form.delayReason}
              onChange={(e) => updateField('delayReason', e.target.value)}
              placeholder="e.g. Weather"
            />
          </div>
          <div className="field">
            <label htmlFor="estimatedArrivalTime">Estimated arrival time (optional)</label>
            <input
              id="estimatedArrivalTime"
              value={form.estimatedArrivalTime}
              onChange={(e) => updateField('estimatedArrivalTime', e.target.value)}
              placeholder="e.g. 18:45"
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Add flight'}
        </button>
      </form>

      {error && <ErrorState message={error} />}
      <SuccessMessage message={success} />
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* 2. View all flights (with delete)                                      */
/* ---------------------------------------------------------------------- */
function AllFlightsPanel() {
  const [flights, setFlights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  async function loadFlights() {
    setLoading(true);
    setError(null);
    try {
      const data = await flightApi.listFlights();
      setFlights(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlights();
  }, []);

  async function handleDelete(id) {
    setDeletingId(id);
    setNotice(null);
    try {
      await flightApi.deleteFlight(id);
      setNotice(`Flight ${id} deleted.`);
      await loadFlights();
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
          All flights
        </h2>
        <button className="btn btn-ghost" onClick={loadFlights} disabled={loading}>
          Refresh
        </button>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Loading flights…" />}
        {!loading && error && <ErrorState message={error} onRetry={loadFlights} />}
        {!loading && !error && flights && flights.length === 0 && (
          <EmptyState title="No flights yet" hint="Add one using the form above." />
        )}
        {!loading && !error && flights && flights.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Flight number</th>
                <th>Airline</th>
                <th>Route</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.id}>
                  <td>
                    <code>{f.id}</code>
                  </td>
                  <td>
                    <code>{f.flightNumber}</code>
                  </td>
                  <td>{f.airline}</td>
                  <td>
                    {f.departure} → {f.arrival}
                  </td>
                  <td>{f.status}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(f.id)}
                      disabled={deletingId === f.id}
                    >
                      {deletingId === f.id ? 'Deleting…' : 'Delete'}
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

/* ---------------------------------------------------------------------- */
/* 3. Look up a flight by ID                                              */
/* ---------------------------------------------------------------------- */
function FlightByIdPanel() {
  const [id, setId] = useState('');
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleLookup(e) {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await flightApi.getFlightById(id);
      setFlight(data);
    } catch (err) {
      setFlight(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">View flight by ID</h2>
      <form onSubmit={handleLookup} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="lookupId">Flight ID</label>
          <input id="lookupId" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. 1" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Looking up…' : 'Look up'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Looking up flight…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && searched && !flight && (
          <EmptyState title="No flight found" hint={`No flight exists with ID ${id}.`} />
        )}
        {!loading && !error && flight && (
          <table className="data-table">
            <tbody>
              <tr>
                <th>ID</th>
                <td>
                  <code>{flight.id}</code>
                </td>
              </tr>
              <tr>
                <th>Flight number</th>
                <td>
                  <code>{flight.flightNumber}</code>
                </td>
              </tr>
              <tr>
                <th>Airline</th>
                <td>{flight.airline}</td>
              </tr>
              <tr>
                <th>Route</th>
                <td>
                  {flight.departure} → {flight.arrival}
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{flight.status}</td>
              </tr>
              <tr>
                <th>Delay reason</th>
                <td>{flight.delayReason || '—'}</td>
              </tr>
              <tr>
                <th>Estimated arrival time</th>
                <td>{flight.estimatedArrivalTime || '—'}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* 4. Flight status (simulated)                                           */
/* ---------------------------------------------------------------------- */
function FlightStatusPanel() {
  const [flightNumber, setFlightNumber] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleCheck(e) {
    e.preventDefault();
    if (!flightNumber) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await flightApi.getStatus(flightNumber);
      setStatus(data);
    } catch (err) {
      setStatus(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">
        Flight status
        <span className="notice-badge">Simulated</span>
      </h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        The backend generates this status on demand — it is not a live feed from an airline or
        flight-tracking service.
      </p>

      <form onSubmit={handleCheck} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="statusFlightNumber">Flight number</label>
          <input
            id="statusFlightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="AI101"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Checking…' : 'Check status'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Checking status…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && searched && !status && (
          <EmptyState title="No status returned" hint="Try a different flight number." />
        )}
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
                <th>Status</th>
                <td>
                  {status.status} <span className="notice-badge">Simulated</span>
                </td>
              </tr>
              <tr>
                <th>Reason</th>
                <td>{status.reason || '—'}</td>
              </tr>
              <tr>
                <th>Arrival time</th>
                <td>{status.arrivalTime || '—'}</td>
              </tr>
              <tr>
                <th>Last updated</th>
                <td>{status.updateTime || '—'}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* 5. Flight notification                                                 */
/* ---------------------------------------------------------------------- */
function FlightNotificationPanel() {
  const [flightNumber, setFlightNumber] = useState('');
  const [notification, setNotification] = useState(null);
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
      const data = await flightApi.getNotification(flightNumber);
      setNotification(data);
    } catch (err) {
      setNotification(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">
        Flight notification
        <span className="notice-badge">Based on simulated status</span>
      </h2>

      <form onSubmit={handleFetch} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="notifFlightNumber">Flight number</label>
          <input
            id="notifFlightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="AI101"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Fetching…' : 'Get notification'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Fetching notification…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && searched && !notification && (
          <EmptyState title="No notification returned" hint="Try a different flight number." />
        )}
        {!loading && !error && notification && (
          <div className="panel" style={{ background: 'var(--color-bg)', marginBottom: 0 }}>
            <p style={{ margin: 0, fontSize: 'var(--text-base)' }}>{notification.message}</p>
            <p style={{ margin: '8px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-ink-soft)' }}>
              Last updated: {notification.updateTime || '—'} · <code>{notification.flightNumber}</code>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
