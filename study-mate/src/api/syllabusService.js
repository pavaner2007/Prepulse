import api from './axios'

export const fetchSyllabusIntelligence = (examType = 'JEE', subject = '') => api.get('/syllabus/intelligence', { params: { examType, subject: subject || undefined } })
export const fetchPersonalizedPriorityMap = () => api.get('/syllabus/priority-map')
export const fetchChapterIntelligence = (examType, subject, chapter) => api.get('/syllabus/intelligence', { params: { examType, subject, chapter } })
