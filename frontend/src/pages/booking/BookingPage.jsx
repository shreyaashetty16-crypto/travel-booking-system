import { useState } from 'react';
import { bookingApi } from '../../api/bookingApi';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import SuccessMessage from '../../components/common/SuccessMessage';

export default function BookingPage() {
  return (
    <div>
      <SeatListPanel title="All seats" fetcher={bookingApi.getAllSeats} emptyHint="No seats configured on the backend." />
      <SeatListPanel title="Available seats" fetcher={bookingApi.getAvailableSeats} emptyHint="No seats currently available." />
      <SeatListPanel title="Premium seats" fetcher={bookingApi.getPremiumSeats} emptyHint="No premium seats configured." />
      <BookSeatPanel />

      <RoomListPanel title="All rooms" fetcher={bookingApi.getAllRooms} emptyHint="No rooms configured on the backend." />
      <RoomListPanel title="Available rooms" fetcher={bookingApi.getAvailableRooms} emptyHint="No rooms currently available." />
      <BookRoomPanel />
      <RoomPreviewPanel />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* A/B/C. Seat lists (all / available / premium)                          */
/* ---------------------------------------------------------------------- */
function SeatListPanel({ title, fetcher, emptyHint }) {
  const [seats, setSeats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    setLoaded(true);
    try {
      const data = await fetcher();
      setSeats(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="panel-title" style={{ marginBottom: 0 }}>
          {title}
        </h2>
        <button className="btn btn-ghost" onClick={load} disabled={loading}>
          {loaded ? 'Refresh' : 'Load'}
        </button>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Loading seats…" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && loaded && seats && seats.length === 0 && <EmptyState title={emptyHint} />}
        {!loading && !error && seats && seats.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Seat</th>
                <th>Status</th>
                <th>Premium</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((s) => (
                <tr key={s.seatNumber}>
                  <td>
                    <code>{s.seatNumber}</code>
                  </td>
                  <td>{s.available ? 'Available' : 'Booked'}</td>
                  <td>{s.premium ? 'Yes' : 'No'}</td>
                  <td>₹{s.price}</td>
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
/* D. Book a seat                                                          */
/* ---------------------------------------------------------------------- */
function BookSeatPanel() {
  const [seatNumber, setSeatNumber] = useState('');
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleBook(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!seatNumber) {
      setError('Enter a seat number.');
      return;
    }
    setBooking(true);
    try {
      const data = await bookingApi.bookSeat(seatNumber);
      if (!data) {
        setError(`No seat found with number "${seatNumber}".`);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Book a seat</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        Demo seat numbers: <code>1A</code>, <code>1B</code>, <code>2A</code>, <code>2B</code>.
        Booking again after a restart works since this resets in memory.
      </p>
      <form onSubmit={handleBook} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="bookSeatNumber">Seat number</label>
          <input id="bookSeatNumber" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} placeholder="1A" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={booking}>
          {booking ? 'Booking…' : 'Book seat'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {error && <ErrorState message={error} />}
        {result && (
          <>
            <SuccessMessage message={`Seat ${result.seatNumber} booked.`} />
            <table className="data-table">
              <tbody>
                <tr>
                  <th>Seat</th>
                  <td>
                    <code>{result.seatNumber}</code>
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{result.available ? 'Available' : 'Booked'}</td>
                </tr>
                <tr>
                  <th>Premium</th>
                  <td>{result.premium ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>₹{result.price}</td>
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
/* E/F. Room lists (all / available)                                      */
/* ---------------------------------------------------------------------- */
function RoomListPanel({ title, fetcher, emptyHint }) {
  const [rooms, setRooms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    setLoaded(true);
    try {
      const data = await fetcher();
      setRooms(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="panel-title" style={{ marginBottom: 0 }}>
          {title}
        </h2>
        <button className="btn btn-ghost" onClick={load} disabled={loading}>
          {loaded ? 'Refresh' : 'Load'}
        </button>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Loading rooms…" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && loaded && rooms && rooms.length === 0 && <EmptyState title={emptyHint} />}
        {!loading && !error && rooms && rooms.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.roomNumber}>
                  <td>
                    <code>{r.roomNumber}</code>
                  </td>
                  <td>{r.roomType}</td>
                  <td>{r.available ? 'Available' : 'Booked'}</td>
                  <td>₹{r.price}</td>
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
/* G. Book a room                                                           */
/* ---------------------------------------------------------------------- */
function BookRoomPanel() {
  const [roomNumber, setRoomNumber] = useState('');
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleBook(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!roomNumber) {
      setError('Enter a room number.');
      return;
    }
    setBooking(true);
    try {
      const data = await bookingApi.bookRoom(roomNumber);
      if (!data) {
        setError(`No room found with number "${roomNumber}".`);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Book a room</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        Demo room numbers: <code>101</code> (Standard), <code>102</code> (Deluxe), <code>103</code>{' '}
        (Suite).
      </p>
      <form onSubmit={handleBook} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="bookRoomNumber">Room number</label>
          <input id="bookRoomNumber" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="102" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={booking}>
          {booking ? 'Booking…' : 'Book room'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {error && <ErrorState message={error} />}
        {result && (
          <>
            <SuccessMessage message={`Room ${result.roomNumber} booked.`} />
            <table className="data-table">
              <tbody>
                <tr>
                  <th>Room</th>
                  <td>
                    <code>{result.roomNumber}</code>
                  </td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>{result.roomType}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{result.available ? 'Available' : 'Booked'}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>₹{result.price}</td>
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
/* H. Room preview                                                          */
/* ---------------------------------------------------------------------- */
function RoomPreviewPanel() {
  const [roomNumber, setRoomNumber] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleFetch(e) {
    e.preventDefault();
    if (!roomNumber) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await bookingApi.getRoomPreview(roomNumber);
      setPreview(data);
    } catch (err) {
      setPreview(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">
        Room preview
        <span className="notice-badge">Placeholder links, not real images</span>
      </h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', marginTop: 0 }}>
        The backend returns <code>example.com</code> placeholder URLs for rooms 101–103, not
        actual photos — so this shows the returned link as text rather than rendering it as an
        image.
      </p>

      <form onSubmit={handleFetch} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="previewRoomNumber">Room number</label>
          <input
            id="previewRoomNumber"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="101"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Fetching…' : 'Get preview'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {loading && <LoadingState label="Fetching preview…" />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && searched && !preview && (
          <EmptyState title="No preview available" hint="Only rooms 101, 102, and 103 have preview data." />
        )}
        {!loading && !error && preview && (
          <table className="data-table">
            <tbody>
              <tr>
                <th>Room</th>
                <td>
                  <code>{preview.roomNumber}</code>
                </td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{preview.roomType}</td>
              </tr>
              <tr>
                <th>Image URL (placeholder)</th>
                <td style={{ wordBreak: 'break-all' }}>{preview.imageUrl}</td>
              </tr>
              <tr>
                <th>3D preview link (placeholder)</th>
                <td style={{ wordBreak: 'break-all' }}>{preview.preview3D}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
