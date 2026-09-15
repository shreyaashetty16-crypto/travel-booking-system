import { apiClient } from './client';

export const pricingApi = {
  getPrice: (flightNumber) => apiClient.get(`/flight/price/${flightNumber}`),

  getPriceHistory: (flightNumber) => apiClient.get(`/flight/pricehistory/${flightNumber}`),

  freezePrice: (flightNumber, price) => apiClient.post(`/flight/freeze/${flightNumber}`, null, { price }),

  getFrozenPrice: (flightNumber) => apiClient.get(`/flight/freeze/${flightNumber}`),
};
