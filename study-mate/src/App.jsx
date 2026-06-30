import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UploadNotes from './pages/UploadNotes'
import AIDoubtSolver from './pages/AIDoubtSolver'
import YouTubeCompanion from './pages/YouTubeCompanion'
import AdaptiveQuiz from './pages/AdaptiveQuiz'
import MistakeMemory from './pages/MistakeMemory'
import StudyPlan from './pages/StudyPlan'
import SyllabusStrategy from './pages/SyllabusStrategy'
import ProgressAnalytics from './pages/ProgressAnalytics'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="doubt" element={<AIDoubtSolver />} />
          <Route path="upload" element={<UploadNotes />} />
          <Route path="youtube" element={<YouTubeCompanion />} />
          <Route path="quiz" element={<AdaptiveQuiz />} />
          <Route path="mistakes" element={<MistakeMemory />} />
          <Route path="study-plan" element={<StudyPlan />} />
          <Route path="syllabus-strategy" element={<SyllabusStrategy />} />
          <Route path="analytics" element={<ProgressAnalytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notes" element={<Navigate to="/upload" replace />} />
          <Route path="chatbot" element={<Navigate to="/doubt" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
