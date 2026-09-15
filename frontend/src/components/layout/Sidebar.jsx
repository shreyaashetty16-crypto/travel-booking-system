import { NavLink } from 'react-router-dom';

// Icons kept as short mono glyphs/codes to match the ticket/boarding-pass
// theme (see styles/components.css .ticket-*) rather than an icon font.
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', code: '••', end: true },
  { to: '/flights', label: 'Flight management', code: 'FLT' },
  { to: '/pricing', label: 'Dynamic pricing', code: '$$' },
  { to: '/cancellation', label: 'Cancellation & refund', code: 'CXL' },
  { to: '/recommendations', label: 'Recommendations', code: 'REC' },
  { to: '/booking', label: 'Seat & room booking', code: 'SEA' },
  { to: '/reviews', label: 'Reviews & ratings', code: 'RVW' },
  { to: '/wishlist', label: 'Wishlist', code: 'WSH' },
  { to: '/admin', label: 'Admin moderation', code: 'ADM' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">TravelBooking</div>
        <div className="sidebar-brand-sub">Internship console</div>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            <span className="sidebar-link-icon">{item.code}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">Spring Boot + MySQL backend</div>
    </aside>
  );
}
