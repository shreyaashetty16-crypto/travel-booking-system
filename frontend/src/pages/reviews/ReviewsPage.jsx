import { useState } from 'react';
import { reviewApi } from '../../api/reviewApi';
import { replyApi } from '../../api/replyApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import SuccessMessage from '../../components/common/SuccessMessage';

export default function ReviewsPage() {
  // Shared so clicking "View replies" on a review row can jump straight
  // into the replies panel below without retyping the review ID.
  const [activeReviewId, setActiveReviewId] = useState('');

  return (
    <div>
      <AddReviewPanel />
      <AllReviewsPanel onViewReplies={(id) => setActiveReviewId(String(id))} />
      <AverageRatingPanel />
      <RepliesPanel activeReviewId={activeReviewId} setActiveReviewId={setActiveReviewId} />
    </div>
  );
}

const RATING_OPTIONS = [1, 2, 3, 4, 5];

/* ---------------------------------------------------------------------- */
/* A. Add a review                                                         */
/* ---------------------------------------------------------------------- */
function AddReviewPanel() {
  const [userName, setUserName] = useState('');
  const [bookingType, setBookingType] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userName || !bookingId || !rating || !comment) {
      setError('Name, booking ID, rating, and comment are required.');
      return;
    }

    setSaving(true);
    try {
      const saved = await reviewApi.addReview({
        userName,
        bookingType: bookingType || null,
        bookingId,
        rating: Number(rating),
        comment,
        photoUrl: photoUrl || null,
      });
      setSuccess(`Review added (ID ${saved.id}) for booking ${saved.bookingId}.`);
      setUserName('');
      setBookingType('');
      setBookingId('');
      setRating('5');
      setComment('');
      setPhotoUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Add a review</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="reviewUserName">Your name</label>
            <input id="reviewUserName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Priya" />
          </div>
          <div className="field">
            <label htmlFor="bookingId">Booking ID</label>
            <input id="bookingId" value={bookingId} onChange={(e) => setBookingId(e.target.value)} placeholder="BK1001" />
          </div>
          <div className="field">
            <label htmlFor="bookingType">Booking type (optional)</label>
            <input
              id="bookingType"
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
              placeholder="Flight / Room"
            />
          </div>
          <div className="field">
            <label htmlFor="rating">Rating</label>
            <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              {RATING_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {'★'.repeat(r)}
                  {'☆'.repeat(5 - r)} ({r})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="photoUrl">Photo URL (optional)</label>
            <input id="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://…" />
          </div>
        </div>

        <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your trip?"
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Submitting…' : 'Add review'}
        </button>
      </form>

      {error && <ErrorState message={error} />}
      <SuccessMessage message={success} />
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* B. All reviews (delete, report, jump to replies)                        */
/* ---------------------------------------------------------------------- */
function AllReviewsPanel({ onViewReplies }) {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  async function loadReviews() {
    setLoading(true);
    setError(null);
    setLoaded(true);
    try {
      const data = await reviewApi.listReviews();
      setReviews(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setBusyId(id);
    setNotice(null);
    try {
      const message = await reviewApi.deleteReview(id);
      setNotice(message || `Review ${id} deleted.`);
      await loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReport(id) {
    setBusyId(id);
    setNotice(null);
    try {
      await reviewApi.reportReview(id);
      setNotice(`Review ${id} marked as reported.`);
      await loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="panel-title" style={{ marginBottom: 0 }}>
          All reviews
        </h2>
        <button className="btn btn-ghost" onClick={loadReviews} disabled={loading}>
          {loaded ? 'Refresh' : 'Load reviews'}
        </button>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Loading reviews…" />}
        {!loading && error && <ErrorState message={error} onRetry={loadReviews} />}
        {!loading && !error && loaded && reviews && reviews.length === 0 && (
          <EmptyState title="No reviews yet" hint="Add one using the form above." />
        )}
        {!loading && !error && reviews && reviews.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <strong>{r.userName}</strong>{' '}
                    <span style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)' }}>
                      · booking <code>{r.bookingId}</code>
                      {r.bookingType ? ` (${r.bookingType})` : ''}
                    </span>
                  </div>
                  <div>
                    {'★'.repeat(r.rating)}
                    {'☆'.repeat(5 - r.rating)}
                    <span className="notice-badge" style={{ marginLeft: 8 }}>
                      {r.status}
                    </span>
                  </div>
                </div>
                <p style={{ margin: '8px 0' }}>{r.comment}</p>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost" onClick={() => onViewReplies(r.id)}>
                    View replies
                  </button>
                  <button className="btn btn-ghost" onClick={() => handleReport(r.id)} disabled={busyId === r.id}>
                    {busyId === r.id ? 'Working…' : 'Report'}
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(r.id)} disabled={busyId === r.id}>
                    {busyId === r.id ? 'Working…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SuccessMessage message={notice} />
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* C. Average rating                                                       */
/* ---------------------------------------------------------------------- */
function AverageRatingPanel() {
  const [bookingId, setBookingId] = useState('');
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleCheck(e) {
    e.preventDefault();
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await reviewApi.getAverageRating(bookingId);
      setAverage(data);
    } catch (err) {
      setAverage(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Average rating</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        The backend returns 0.0 for a booking ID with no reviews, rather than an error.
      </p>
      <form onSubmit={handleCheck} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="avgBookingId">Booking ID</label>
          <input id="avgBookingId" value={bookingId} onChange={(e) => setBookingId(e.target.value)} placeholder="BK1001" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Checking…' : 'Get average rating'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Fetching average…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && searched && average !== null && (
          <div className="panel" style={{ background: 'var(--color-bg)', marginBottom: 0 }}>
            <strong style={{ fontSize: 'var(--text-lg)' }}>{average.toFixed(1)} / 5</strong>
            {average === 0 && (
              <div style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                No reviews found for this booking ID (or it hasn't been reviewed yet).
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Replies for a review                                                    */
/* ---------------------------------------------------------------------- */
function RepliesPanel({ activeReviewId, setActiveReviewId }) {
  const [replies, setReplies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [replyUserName, setReplyUserName] = useState('');
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  async function loadReplies(e) {
    if (e) e.preventDefault();
    if (!activeReviewId) {
      setError('Enter a review ID first.');
      return;
    }
    setLoading(true);
    setError(null);
    setLoaded(true);
    try {
      const data = await replyApi.getReplies(activeReviewId);
      setReplies(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddReply(e) {
    e.preventDefault();
    setSaveError(null);
    setNotice(null);

    if (!activeReviewId || !replyUserName || !replyText) {
      setSaveError('Review ID, your name, and reply text are all required.');
      return;
    }

    setSaving(true);
    try {
      await replyApi.addReply({
        reviewId: Number(activeReviewId),
        userName: replyUserName,
        replyText,
      });
      setReplyUserName('');
      setReplyText('');
      setNotice('Reply added.');
      await loadReplies();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteReply(id) {
    setDeletingId(id);
    setNotice(null);
    try {
      await replyApi.deleteReply(id);
      setNotice(`Reply ${id} deleted.`);
      await loadReplies();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Replies</h2>

      <form onSubmit={loadReplies} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 220 }}>
          <label htmlFor="replyReviewId">Review ID</label>
          <input
            id="replyReviewId"
            value={activeReviewId}
            onChange={(e) => setActiveReviewId(e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Load replies'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Loading replies…" />}
        {!loading && error && <ErrorState message={error} onRetry={loadReplies} />}
        {!loading && !error && loaded && replies && replies.length === 0 && (
          <EmptyState title="No replies for this review yet" hint="Add the first one below." />
        )}
        {!loading && !error && replies && replies.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {replies.map((rep) => (
              <div
                key={rep.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3)',
                }}
              >
                <div>
                  <strong>{rep.userName}</strong>: {rep.replyText}
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteReply(rep.id)}
                  disabled={deletingId === rep.id}
                >
                  {deletingId === rep.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel" style={{ background: 'var(--color-bg)', marginBottom: 0, marginTop: 'var(--space-4)' }}>
        <div className="panel-title" style={{ fontSize: 'var(--text-sm)' }}>
          Add a reply
        </div>
        <form onSubmit={handleAddReply}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="replyUserName">Your name</label>
              <input
                id="replyUserName"
                value={replyUserName}
                onChange={(e) => setReplyUserName(e.target.value)}
                placeholder="Priya"
              />
            </div>
            <div className="field">
              <label htmlFor="replyText">Reply</label>
              <input
                id="replyText"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Thanks for the feedback!"
              />
            </div>
          </div>
          <button className="btn btn-accent" type="submit" disabled={saving}>
            {saving ? 'Adding…' : 'Add reply'}
          </button>
        </form>
        {saveError && <ErrorState message={saveError} />}
        <SuccessMessage message={notice} />
      </div>
    </section>
  );
}
