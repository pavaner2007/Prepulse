import api from './axios'

export const fetchTodayPlan = () => api.get('/study-plan/today')
export const generateTodayPlan = () => api.post('/study-plan/generate')
