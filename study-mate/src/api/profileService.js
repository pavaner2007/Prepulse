import api from './axios'

export const fetchStudentProfile = () => api.get('/profile')
export const saveStudentProfile = (data) => api.post('/profile', data)
