import Sidebar from './Sidebar';
import Header from './Header';

export default function PageLayout({ title, children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-area">
        <Header title={title} />
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
