import api from './axios'

export const fetchDashboardAnalytics = () => api.get('/analytics/dashboard')
export const fetchReadiness = () => api.get('/analytics/readiness')
export const fetchMastery = () => api.get('/analytics/mastery')
