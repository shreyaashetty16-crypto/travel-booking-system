import { apiClient } from './client';

export const replyApi = {
  addReply: (reply) => apiClient.post('/reply/add', reply),

  getReplies: (reviewId) => apiClient.get(`/reply/${reviewId}`),

  deleteReply: (id) => apiClient.del(`/reply/delete/${id}`),
};
