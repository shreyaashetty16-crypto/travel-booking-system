import { apiClient } from './client';

export const cancellationApi = {
  getReasons: () => apiClient.get('/flight/cancellation/reasons'),

  cancelFlight: (flightNumber, bookingAmount, reason, cancelledWithin24Hours) =>
    apiClient.post(`/flight/cancel/${flightNumber}`, null, {
      bookingAmount,
      reason,
      cancelledWithin24Hours,
    }),

  getAllCancellations: () => apiClient.get('/flight/cancel/all'),

  getRefundDetails: (flightNumber) => apiClient.get(`/flight/refund/${flightNumber}`),

  getRefundStatus: (flightNumber) => apiClient.get(`/flight/refundstatus/${flightNumber}`),

  updateRefundStatus: (flightNumber, status) =>
    apiClient.put(`/flight/refundstatus/${flightNumber}`, null, { status }),
};
