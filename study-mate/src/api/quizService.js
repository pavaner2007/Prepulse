import api from './axios'

export const generateQuiz = (data) => api.post('/quiz/generate', data)
export const submitQuiz = (data) => api.post('/quiz/submit', data)
export const fetchQuizHistory = () => api.get('/quiz/history')
