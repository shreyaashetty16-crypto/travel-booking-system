import { apiClient } from './client';

// Every function here maps 1:1 to an existing FlightController endpoint.
// No endpoints are invented.

export const flightApi = {
  addFlight: (flight) => apiClient.post('/flight/save', flight),

  listFlights: () => apiClient.get('/flight/list'),

  getFlightById: (id) => apiClient.get(`/flight/${id}`),

  deleteFlight: (id) => apiClient.del(`/flight/delete/${id}`),

  getStatus: (flightNumber) => apiClient.get(`/flight/status/${flightNumber}`),

  getNotification: (flightNumber) => apiClient.get(`/flight/notification/${flightNumber}`),
};
