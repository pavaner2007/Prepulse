import { useEffect, useState } from 'react'
import { FileText, Loader2, UploadCloud } from 'lucide-react'
import UploadDropzone from '../components/UploadDropzone'
import EmptyState from '../components/EmptyState'
import ResourceSummaryModal from '../components/ResourceSummaryModal'
import { fetchResources, uploadResource } from '../api/resourceService'
import { getChapters, getSubjects } from '../data/syllabusData'
const resourceTypes = ['Notes', 'PYQ', 'Mock Test', 'Worksheet', 'Question Image']

function UploadNotes() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedResourceForSummary, setSelectedResourceForSummary] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ title: '', examType: 'JEE', subject: 'Physics', chapter: 'Electrostatics', sourceType: 'Notes', tags: '', description: '' })

  const loadResources = async () => {
    try {
      const res = await fetchResources()
      setResources(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadResources() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) return setMessage('Please select a file first.')
    setSubmitting(true)
    setMessage('')
    try {
      const data = new FormData()
      data.append('file', selectedFile)
      Object.entries(form).forEach(([key, value]) => data.append(key, value))
      const res = await uploadResource(data)
      setResources(prev => [res.data.resource, ...prev])
      setSelectedFile(null)
      setForm({ title: '', examType: 'JEE', subject: 'Physics', chapter: 'Electrostatics', sourceType: 'Notes', tags: '', description: '' })
      setMessage(`${res.data.message} Extracted characters: ${res.data.extractedTextLength}. Chunks created: ${res.data.chunksCreated}.`)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary-600 mb-2">Personal Knowledge Base</p>
          <h1 className="text-3xl font-bold text-slate-900">Upload Resources</h1>
          <p className="text-slate-500 mt-1">Upload notes, worksheets, PYQs, mock reports, or question images for RAG-powered doubt solving.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
          <UploadDropzone onFileSelect={setSelectedFile} acceptedTypes=".pdf,.txt,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp" />

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Resource Title"><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Electrostatics Short Notes" /></Field>
            <Field label="Exam"><select className="input-field" value={form.examType} onChange={e => { const examType = e.target.value; const subject = getSubjects(examType)[0]; setForm({ ...form, examType, subject, chapter: getChapters(examType, subject)[0] }) }}>{['JEE', 'NEET'].map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Subject"><select className="input-field" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value, chapter: getChapters(form.examType, e.target.value)[0] })}>{getSubjects(form.examType).map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Official Chapter"><select className="input-field" value={form.chapter} onChange={e => setForm({ ...form, chapter: e.target.value })}>{getChapters(form.examType, form.subject).map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Resource Type"><select className="input-field" value={form.sourceType} onChange={e => setForm({ ...form, sourceType: e.target.value })}>{resourceTypes.map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Tags"><input className="input-field" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="formula, high-weightage, revision" /></Field>
            <Field label="Description"><input className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional short note" /></Field>
          </div>

          {message && <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100 text-sm text-primary-800">{message}</div>}

          <button disabled={submitting} className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 transition-colors disabled:opacity-60">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} Upload & Index Resource
          </button>
        </form>

        <aside className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-3xl p-6 border border-primary-100">
          <h2 className="text-xl font-bold text-slate-900 mb-3">What happens after upload?</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <p><b>1.</b> PDF/TXT text is extracted and stored safely with your account.</p>
            <p><b>2.</b> Content is chunked and indexed for simple RAG retrieval.</p>
            <p><b>3.</b> AI Doubt Solver can use your uploaded notes as source context.</p>
            <p><b>4.</b> Unsupported formats still upload as metadata so the demo flow does not break.</p>
          </div>
        </aside>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Uploaded Resources</h2>
        {loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-600" /></div> : resources.length ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {resources.map(resource => (
              <div key={resource._id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center"><FileText /></div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{resource.title}</h3>
                      <p className="text-sm text-slate-500">{resource.subject} • {resource.chapter || 'General'}</p>
                      <p className="text-xs text-slate-400 mt-1">{resource.sourceType} • {resource.fileType} • {resource.fileSize}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-4 line-clamp-2">{resource.description || 'Uploaded learning resource'}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedResourceForSummary(resource)}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors text-center"
                  >
                    View Summary & Ask
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Upload your first notes PDF" description="Upload your first notes PDF to build your personal knowledge base." />
        )}
      </section>

      {selectedResourceForSummary && (
        <ResourceSummaryModal 
          resource={selectedResourceForSummary} 
          onClose={() => setSelectedResourceForSummary(null)} 
        />
      )}
    </div>
  )
}

function Field({ label, children }) {
  return <label className="block"><span className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</span>{children}</label>
}

export default UploadNotes
