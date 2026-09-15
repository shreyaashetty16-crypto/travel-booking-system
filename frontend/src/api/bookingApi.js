import { apiClient } from './client';

export const bookingApi = {
  getAllSeats: () => apiClient.get('/flight/seats'),
  getAvailableSeats: () => apiClient.get('/flight/seats/available'),
  getPremiumSeats: () => apiClient.get('/flight/seats/premium'),
  bookSeat: (seatNumber) => apiClient.post(`/flight/seats/book/${seatNumber}`),

  getAllRooms: () => apiClient.get('/flight/rooms'),
  getAvailableRooms: () => apiClient.get('/flight/rooms/available'),
  bookRoom: (roomNumber) => apiClient.post(`/flight/rooms/book/${roomNumber}`),
  getRoomPreview: (roomNumber) => apiClient.get(`/flight/rooms/preview/${roomNumber}`),
};
