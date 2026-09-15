import { useState } from 'react';
import { pricingApi } from '../../api/pricingApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import SuccessMessage from '../../components/common/SuccessMessage';

export default function PricingPage() {
  return (
    <div>
      <CurrentPricePanel />
      <PriceFreezePanel />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 1 & 2. Current price + price history                                   */
/* ---------------------------------------------------------------------- */
function CurrentPricePanel() {
  const [flightNumber, setFlightNumber] = useState('');
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState(null);
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
      const [priceData, historyData] = await Promise.all([
        pricingApi.getPrice(flightNumber),
        pricingApi.getPriceHistory(flightNumber),
      ]);
      setPrice(priceData);
      setHistory(historyData);
    } catch (err) {
      setPrice(null);
      setHistory(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const historyValues = history?.priceHistory || [];
  const maxHistoryValue = historyValues.length > 0 ? Math.max(...historyValues) : 0;

  return (
    <section className="panel">
      <h2 className="panel-title">
        Current price &amp; price history
        <span className="notice-badge">Rule-based</span>
      </h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        Only flight numbers <code>AI101</code>, <code>AI102</code>, and <code>AI103</code> have
        distinct pricing rules on the backend — any other flight number returns the same default
        price. Price history is also a fixed demo sequence shared by every flight number, not
        data stored per flight.
      </p>

      <form onSubmit={handleCheck} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="priceFlightNumber">Flight number</label>
          <input
            id="priceFlightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="AI101"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Checking…' : 'Check price'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Checking price…" />}
        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && searched && !price && (
          <EmptyState title="No pricing data returned" hint="Try a different flight number." />
        )}

        {!loading && !error && price && (
          <>
            <table className="data-table">
              <tbody>
                <tr>
                  <th>Flight number</th>
                  <td>
                    <code>{price.flightNumber}</code>
                  </td>
                </tr>
                <tr>
                  <th>Original price</th>
                  <td>₹{price.originalPrice}</td>
                </tr>
                <tr>
                  <th>Current price</th>
                  <td>
                    <strong>₹{price.currentPrice}</strong>
                  </td>
                </tr>
                <tr>
                  <th>Season</th>
                  <td>{price.season}</td>
                </tr>
                <tr>
                  <th>Price status</th>
                  <td>{price.priceStatus}</td>
                </tr>
                <tr>
                  <th>Reason</th>
                  <td>{price.reason}</td>
                </tr>
                <tr>
                  <th>Last updated</th>
                  <td>{price.lastUpdated}</td>
                </tr>
              </tbody>
            </table>

            {historyValues.length > 0 && (
              <div style={{ marginTop: 'var(--space-5)' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-soft)', marginBottom: 'var(--space-2)' }}>
                  Price history (fixed demo sequence)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {historyValues.map((value, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <code style={{ width: 24, color: 'var(--color-ink-faint)', fontSize: 'var(--text-xs)' }}>
                        #{i + 1}
                      </code>
                      <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: 4, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${(value / maxHistoryValue) * 100}%`,
                            background: 'var(--color-accent)',
                            padding: '6px 10px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-ink)',
                            minWidth: 60,
                            boxSizing: 'border-box',
                          }}
                        >
                          ₹{value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* 3 & 4. Freeze a price / view frozen price                              */
/* ---------------------------------------------------------------------- */
function PriceFreezePanel() {
  const [flightNumber, setFlightNumber] = useState('');
  const [freezeAmount, setFreezeAmount] = useState('');
  const [frozen, setFrozen] = useState(null);
  const [freezing, setFreezing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [checked, setChecked] = useState(false);

  async function handleFreeze(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!flightNumber || !freezeAmount) {
      setError('Enter both a flight number and a price to freeze.');
      return;
    }

    setFreezing(true);
    try {
      const result = await pricingApi.freezePrice(flightNumber, Number(freezeAmount));
      setFrozen(result);
      setChecked(true);
      setSuccess(`Price for ${result.flightNumber} frozen at ₹${result.frozenPrice}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setFreezing(false);
    }
  }

  async function handleCheckFrozen() {
    if (!flightNumber) {
      setError('Enter a flight number first.');
      return;
    }
    setError(null);
    setSuccess(null);
    setChecking(true);
    setChecked(true);
    try {
      const result = await pricingApi.getFrozenPrice(flightNumber);
      setFrozen(result);
    } catch (err) {
      setFrozen(null);
      setError(err.message);
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">
        Price freeze
        <span className="notice-badge">In-memory — resets on backend restart</span>
      </h2>

      <form onSubmit={handleFreeze}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="freezeFlightNumber">Flight number</label>
            <input
              id="freezeFlightNumber"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="AI101"
            />
          </div>
          <div className="field">
            <label htmlFor="freezeAmount">Price to freeze (₹)</label>
            <input
              id="freezeAmount"
              type="number"
              min="0"
              step="1"
              value={freezeAmount}
              onChange={(e) => setFreezeAmount(e.target.value)}
              placeholder="6000"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-primary" type="submit" disabled={freezing}>
            {freezing ? 'Freezing…' : 'Freeze this price'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={handleCheckFrozen} disabled={checking}>
            {checking ? 'Checking…' : 'Check frozen price'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {error && <ErrorState message={error} />}
        <SuccessMessage message={success} />

        {!error && checked && !freezing && !checking && !frozen && (
          <EmptyState
            title="No frozen price for this flight"
            hint="Freeze a price above, then check again."
          />
        )}

        {!error && frozen && (
          <table className="data-table">
            <tbody>
              <tr>
                <th>Flight number</th>
                <td>
                  <code>{frozen.flightNumber}</code>
                </td>
              </tr>
              <tr>
                <th>Frozen price</th>
                <td>
                  <strong>₹{frozen.frozenPrice}</strong>
                </td>
              </tr>
              <tr>
                <th>Frozen at</th>
                <td>{new Date(frozen.freezeTime).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
