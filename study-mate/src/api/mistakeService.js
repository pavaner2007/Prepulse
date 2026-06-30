import api from './axios'

export const fetchMistakes = () => api.get('/mistakes')
export const createMistake = (data) => api.post('/mistakes', data)
