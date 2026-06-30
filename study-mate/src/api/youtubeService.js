import api from './axios'

export const analyzeYoutube = (data) => api.post('/youtube/analyze', data)
