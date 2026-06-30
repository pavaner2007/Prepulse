import { useEffect, useState, useRef } from 'react'
import { X, Sparkles, Send, Loader2, BookOpen, MessageSquare, AlertCircle } from 'lucide-react'
import { summarizeResource } from '../api/resourceService'
import { askDoubt } from '../api/doubtService'

function ResourceSummaryModal({ resource, onClose }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [summaryData, setSummaryData] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState('')

  const [chatMessages, setChatMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')

  const chatEndRef = useRef(null)

  useEffect(() => {
    if (!resource) return
    const getSummary = async () => {
      setSummaryLoading(true)
      setSummaryError('')
      try {
        const res = await summarizeResource(resource._id)
        setSummaryData(res.data)
      } catch (err) {
        setSummaryError(err.response?.data?.message || 'Failed to generate document summary. Make sure the uploaded file has extractable text.')
      } finally {
        setSummaryLoading(false)
      }
    }
    getSummary()
  }, [resource])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatLoading])

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim() || chatLoading) return
    const currentQuestion = question.trim()
    setQuestion('')
    setChatError('')
    
    // Add user message to chat list
    setChatMessages(prev => [...prev, { sender: 'user', text: currentQuestion }])
    setChatLoading(true)

    try {
      const res = await askDoubt({
        question: currentQuestion,
        subject: resource.subject,
        chapter: resource.chapter,
        documentId: resource._id
      })
      
      const answerText = res.data.answer?.finalAnswer || 'Could not get an answer.'
      const steps = res.data.answer?.stepByStep || []
      
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: answerText,
        steps: Array.isArray(steps) ? steps : [steps].filter(Boolean),
        concept: res.data.answer?.conceptUsed,
        formula: res.data.answer?.formulaUsed
      }])
    } catch (err) {
      setChatError('Failed to get answer. Please try again.')
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Sorry, I couldn\'t process that question. Check your connection or try again.',
        isError: true
      }])
    } finally {
      setChatLoading(false)
    }
  }

  if (!resource) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <header className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-md mb-2">
              {resource.subject} • {resource.chapter || 'General'}
            </span>
            <h2 className="text-xl font-bold text-slate-950 truncate">{resource.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{resource.sourceType} • {resource.fileType} • {resource.fileSize}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-450 hover:text-slate-600 hover:bg-slate-200/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 py-4 px-4 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'summary' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> AI Document Summary
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 py-4 px-4 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'qa' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Ask Document AI
          </button>
        </div>

        {/* Modal Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {activeTab === 'summary' ? (
            <div className="space-y-6">
              {summaryLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                  <p className="text-sm font-medium text-slate-650 animate-pulse">Reading document & extracting summary...</p>
                </div>
              ) : summaryError ? (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3 text-amber-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">Summarization Failed</h4>
                    <p className="text-sm">{summaryError}</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-5">
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 text-primary-600 font-bold text-base">
                        <Sparkles className="w-5 h-5" /> Summary Overview
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{summaryData?.summary}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm">Key Concepts & Points</h3>
                      {summaryData?.keyPoints && summaryData.keyPoints.length > 0 ? (
                        <ul className="space-y-2.5">
                          {summaryData.keyPoints.map((point, index) => (
                            <li key={index} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[10px]">{index + 1}</span>
                              <span className="leading-normal">{point}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500">No key points extracted.</p>
                      )}
                    </div>

                    <div className="p-4 bg-slate-100 rounded-2xl text-center space-y-3">
                      <p className="text-xs text-slate-500">Want to deep-dive into the concepts of this note?</p>
                      <button
                        onClick={() => setActiveTab('qa')}
                        className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all"
                      >
                        Ask questions in Chat
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full min-h-[350px]">
              {/* Grounded RAG Disclaimer */}
              <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-xl text-xs flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>Answers below are strictly grounded using <b>{resource.fileName}</b> as primary context.</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[220px]">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-305 mx-auto" />
                    <p className="text-sm font-semibold text-slate-650">Ask anything about this document</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">AI will parse your note and provide step-by-step answers grounded in the note's formulas and concepts.</p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 max-w-[85%] rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-primary-600 text-white font-medium rounded-tr-none' 
                          : msg.isError 
                            ? 'bg-red-50 text-red-700 border border-red-100' 
                            : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none space-y-3'
                      }`}>
                        <p>{msg.text}</p>
                        
                        {msg.steps && msg.steps.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="font-bold text-slate-900 text-xs mb-1.5">Step-by-step derivation:</p>
                            <ol className="list-decimal pl-4 text-xs space-y-1.5 text-slate-600">
                              {msg.steps.map((step, sIdx) => <li key={sIdx}>{step}</li>)}
                            </ol>
                          </div>
                        )}

                        {(msg.concept || msg.formula) && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
                            {msg.concept && (
                              <div className="p-2 bg-slate-50 rounded-lg">
                                <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">Concept</span>
                                <span className="text-slate-700 font-medium">{msg.concept}</span>
                              </div>
                            )}
                            {msg.formula && (
                              <div className="p-2 bg-slate-50 rounded-lg">
                                <span className="block font-bold text-slate-400 uppercase tracking-wider mb-0.5">Formula</span>
                                <span className="text-slate-700 font-medium">{msg.formula}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                      <span>Analyzing document to answer...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAsk} className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder={`Ask a question about ${resource.fileName}...`}
                  required
                  className="flex-1 input-field"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {chatError && <p className="text-xs text-red-650 mt-2">{chatError}</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ResourceSummaryModal
