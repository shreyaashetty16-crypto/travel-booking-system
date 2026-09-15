import { Routes, Route } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import Dashboard from './pages/Dashboard';
import FlightsPage from './pages/flights/FlightsPage';
import PricingPage from './pages/pricing/PricingPage';
import CancellationPage from './pages/cancellation/CancellationPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import WishlistPage from './pages/wishlist/WishlistPage';
import AdminPage from './pages/admin/AdminPage';
import RecommendationsPage from './pages/recommendations/RecommendationsPage';
import BookingPage from './pages/booking/BookingPage';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageLayout title="Dashboard">
            <Dashboard />
          </PageLayout>
        }
      />
      <Route
        path="/flights"
        element={
          <PageLayout title="Flight management">
            <FlightsPage />
          </PageLayout>
        }
      />
      <Route
        path="/pricing"
        element={
          <PageLayout title="Dynamic pricing">
            <PricingPage />
          </PageLayout>
        }
      />
      <Route
        path="/cancellation"
        element={
          <PageLayout title="Cancellation & refund">
            <CancellationPage />
          </PageLayout>
        }
      />
      <Route
        path="/reviews"
        element={
          <PageLayout title="Reviews & ratings">
            <ReviewsPage />
          </PageLayout>
        }
      />
      <Route
        path="/wishlist"
        element={
          <PageLayout title="Wishlist">
            <WishlistPage />
          </PageLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <PageLayout title="Admin moderation">
            <AdminPage />
          </PageLayout>
        }
      />
      <Route
        path="/recommendations"
        element={
          <PageLayout title="Recommendations">
            <RecommendationsPage />
          </PageLayout>
        }
      />
      <Route
        path="/booking"
        element={
          <PageLayout title="Seat & room booking">
            <BookingPage />
          </PageLayout>
        }
      />
    </Routes>
  );
}
