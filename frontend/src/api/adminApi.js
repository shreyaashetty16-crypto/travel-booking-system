import { apiClient } from './client';

export const adminApi = {
  register: (admin) => apiClient.post('/admin/register', admin),

  login: (admin) => apiClient.post('/admin/login', admin),

  getAllReviews: () => apiClient.get('/admin/reviews'),

  deleteReview: (id) => apiClient.del(`/admin/reviews/${id}`),
};
