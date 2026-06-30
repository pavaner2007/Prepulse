import api from './axios'

export const fetchResources = (params) => api.get('/resources', { params })
export const uploadResource = (formData) => api.post('/resources/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const summarizeResource = (id) => api.post(`/resources/${id}/summarize`)
