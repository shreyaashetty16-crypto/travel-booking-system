import { apiClient } from './client';

export const wishlistApi = {
  addToWishlist: (item) => apiClient.post('/wishlist/add', item),

  getWishlist: (userName) => apiClient.get(`/wishlist/${userName}`),

  deleteWishlistItem: (id) => apiClient.del(`/wishlist/delete/${id}`),
};
