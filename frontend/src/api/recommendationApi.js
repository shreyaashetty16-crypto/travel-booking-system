import { apiClient } from './client';

export const recommendationApi = {
  getGeneral: (budget, preference) =>
    apiClient.get('/flight/recommendation', { budget, preference }),

  getPersonalized: (userName, budget) =>
    apiClient.get('/flight/recommendation/personalized', { userName, budget }),

  getHistoryBased: (userName, budget) =>
    apiClient.get('/flight/recommendation/history-based', { userName, budget }),

  getCollaborative: (userName, budget) =>
    apiClient.get('/flight/recommendation/collaborative', { userName, budget }),

  // Backend takes these as query params (@RequestParam), not a JSON body.
  saveHistory: (userName, destination, category, budget, interaction) =>
    apiClient.post('/flight/recommendation/history', null, {
      userName,
      destination,
      category,
      budget,
      interaction,
    }),

  getHistory: (userName) => apiClient.get(`/flight/recommendation/history/${userName}`),

  updateFeedback: (id, interaction) =>
    apiClient.put(`/flight/recommendation/history/${id}/feedback`, null, { interaction }),

  savePreference: (preference) => apiClient.post('/flight/preferences', preference),

  getPreference: (userName) => apiClient.get(`/flight/preferences/${userName}`),

  updatePreference: (userName, preference) =>
    apiClient.put(`/flight/preferences/${userName}`, preference),

  deletePreference: (userName) => apiClient.del(`/flight/preferences/${userName}`),
};
