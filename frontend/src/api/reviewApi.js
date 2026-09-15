import { apiClient } from './client';

export const reviewApi = {
  addReview: (review) => apiClient.post('/reviews/add', review),

  listReviews: () => apiClient.get('/reviews/all'),

  deleteReview: (id) => apiClient.del(`/reviews/delete/${id}`),

  reportReview: (id) => apiClient.put(`/reviews/report/${id}`),

  getAverageRating: (bookingId) => apiClient.get(`/reviews/average/${bookingId}`),
};
