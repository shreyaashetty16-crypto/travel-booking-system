import { Link } from 'react-router-dom';

const MODULES = [
  {
    to: '/flights',
    index: 'Task 1',
    title: 'Flight management',
    desc: 'Add, list, and remove flights, plus simulated flight status and notifications.',
    code: 'FLT',
  },
  {
    to: '/pricing',
    index: 'Task 2',
    title: 'Dynamic pricing',
    desc: 'Rule-based pricing, price history, and price freeze for a flight.',
    code: '$$',
  },
  {
    to: '/cancellation',
    index: 'Task 3',
    title: 'Cancellation & refund',
    desc: 'Cancel a booking, view refund amount and reason, and track refund status.',
    code: 'CXL',
  },
  {
    to: '/recommendations',
    index: 'Task 4',
    title: 'Travel recommendations',
    desc: 'Rule-based destination suggestions: general, personalized, history-based, and collaborative-style.',
    code: 'REC',
  },
  {
    to: '/booking',
    index: 'Task 5',
    title: 'Seat & room booking',
    desc: 'Browse and book demo seats and rooms, with a room preview link.',
    code: 'SEA',
  },
  {
    to: '/reviews',
    index: 'Task 6',
    title: 'Reviews & ratings',
    desc: 'Add reviews and ratings, view the average rating, and reply to reviews.',
    code: 'RVW',
  },
  {
    to: '/wishlist',
    index: 'Task 6 · Wishlist',
    title: 'Wishlist',
    desc: 'Add, view, and remove wishlist items for a user.',
    code: 'WSH',
  },
  {
    to: '/admin',
    index: 'Task 6 · Admin',
    title: 'Admin moderation',
    desc: 'Admin login and review moderation, shown separately for easier evaluation.',
    code: 'ADM',
  },
];

export default function Dashboard() {
  return (
    <div>
      <section className="panel" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="ticket-index">Internship project · Elevance Skills</div>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
          Travel Booking &amp; Flight Management
        </h1>
        <p style={{ color: 'var(--color-ink-soft)', maxWidth: '640px', marginBottom: 0 }}>
          A Spring Boot + MySQL backend covering six internship tasks — flight management, dynamic
          pricing, cancellations &amp; refunds, travel recommendations, seat/room booking, and
          reviews &amp; wishlist — with this React console as a visual interface for demonstrating
          each one. Some features (pricing rules, seat/room data, recommendations) are rule-based
          demo logic rather than live external services or machine learning; each page notes this
          where relevant.
        </p>
      </section>

      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {MODULES.map((mod) => (
          <Link key={mod.to} to={mod.to} className="ticket">
            <div className="ticket-main">
              <div className="ticket-index">{mod.index}</div>
              <div className="ticket-title">{mod.title}</div>
              <p className="ticket-desc">{mod.desc}</p>
            </div>
            <div className="ticket-stub">
              <span className="ticket-tag">{mod.code}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
