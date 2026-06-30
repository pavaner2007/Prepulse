import api from './axios'

export const askDoubt = (data) => api.post('/doubt/ask', data)
export const extractQuestionImage = (formData) => api.post('/doubt/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
