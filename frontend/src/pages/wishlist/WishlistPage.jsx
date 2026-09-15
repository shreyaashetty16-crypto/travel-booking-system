import { useState } from 'react';
import { wishlistApi } from '../../api/wishlistApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import SuccessMessage from '../../components/common/SuccessMessage';

export default function WishlistPage() {
  return (
    <div>
      <AddToWishlistPanel />
      <ViewWishlistPanel />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* A. Add to wishlist                                                      */
/* ---------------------------------------------------------------------- */
function AddToWishlistPanel() {
  const [userName, setUserName] = useState('');
  const [itemType, setItemType] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userName || !itemType || !itemId || !itemName) {
      setError('All fields are required.');
      return;
    }

    setSaving(true);
    try {
      const saved = await wishlistApi.addToWishlist({ userName, itemType, itemId, itemName });
      setSuccess(`"${saved.itemName}" added to ${saved.userName}'s wishlist (ID ${saved.id}).`);
      setItemType('');
      setItemId('');
      setItemName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Add to wishlist</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="wishUserName">User name</label>
            <input id="wishUserName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Priya" />
          </div>
          <div className="field">
            <label htmlFor="itemType">Item type</label>
            <input
              id="itemType"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              placeholder="Flight / Room"
            />
          </div>
          <div className="field">
            <label htmlFor="itemId">Item ID</label>
            <input id="itemId" value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="AI101 or room number" />
          </div>
          <div className="field">
            <label htmlFor="itemName">Item name</label>
            <input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Air India AI101 to Delhi"
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Adding…' : 'Add to wishlist'}
        </button>
      </form>

      {error && <ErrorState message={error} />}
      <SuccessMessage message={success} />
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* B & C. View wishlist by user + delete item                              */
/* ---------------------------------------------------------------------- */
function ViewWishlistPanel() {
  const [userName, setUserName] = useState('');
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  async function loadWishlist(e) {
    if (e) e.preventDefault();
    if (!userName) return;
    setLoading(true);
    setError(null);
    setLoaded(true);
    setNotice(null);
    try {
      const data = await wishlistApi.getWishlist(userName);
      setItems(data || []);
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
      const message = await wishlistApi.deleteWishlistItem(id);
      setNotice(message || `Item ${id} removed.`);
      await loadWishlist();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">View wishlist</h2>

      <form onSubmit={loadWishlist} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="viewWishUserName">User name</label>
          <input
            id="viewWishUserName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Priya"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Load wishlist'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Loading wishlist…" />}
        {!loading && error && <ErrorState message={error} onRetry={loadWishlist} />}
        {!loading && !error && loaded && items && items.length === 0 && (
          <EmptyState title="No wishlist items for this user" hint="Add one using the form above." />
        )}
        {!loading && !error && items && items.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item type</th>
                <th>Item</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <code>{item.id}</code>
                  </td>
                  <td>{item.itemType}</td>
                  <td>
                    {item.itemName} <span style={{ color: 'var(--color-ink-soft)' }}>({item.itemId})</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? 'Removing…' : 'Remove'}
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
