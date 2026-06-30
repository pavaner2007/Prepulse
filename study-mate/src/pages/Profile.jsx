import { useEffect, useState } from 'react'
import { Loader2, Save, Target, UserCircle } from 'lucide-react'
import { fetchProfile, updateProfile } from '../api/userService'
import { fetchStudentProfile, saveStudentProfile } from '../api/profileService'
import { useAuth } from '../context/AuthContext'
import { getSubjects } from '../data/syllabusData'

function Profile() {
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [userForm, setUserForm] = useState({ name: '', bio: '', college: '' })
  const [profile, setProfile] = useState({ examType: 'JEE', classLevel: '12', targetScore: 650, targetExamDate: '', dailyStudyHours: 4, strongSubjects: ['Chemistry'], weakSubjects: ['Physics'], preferredLanguage: 'English', preparationMode: 'Self-study' })

  useEffect(() => {
    Promise.all([fetchProfile(), fetchStudentProfile()])
      .then(([userRes, profileRes]) => {
        const u = userRes.data.user
        setUserForm({ name: u.name || '', bio: u.bio || '', college: u.college || '' })
        setProfile({ ...profile, ...profileRes.data, targetExamDate: profileRes.data.targetExamDate ? profileRes.data.targetExamDate.slice(0, 10) : '' })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleSubject = (field, subject) => {
    const current = profile[field] || []
    setProfile({ ...profile, [field]: current.includes(subject) ? current.filter(s => s !== subject) : [...current, subject] })
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const [userRes, profileRes] = await Promise.all([updateProfile(userForm), saveStudentProfile(profile)])
      updateUser(userRes.data)
      setProfile({ ...profileRes.data, targetExamDate: profileRes.data.targetExamDate ? profileRes.data.targetExamDate.slice(0, 10) : '' })
      setMessage('Profile and JEE/NEET onboarding saved successfully.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary-600" /></div>

  return (
    <form onSubmit={save} className="space-y-6">
      <header className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center gap-4">
        <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center"><UserCircle className="w-8 h-8" /></div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile & Onboarding</h1>
          <p className="text-slate-500">Set your exam target so PrepPulse AI can personalize your study GPS.</p>
        </div>
      </header>

      <section className="grid xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Account</h2>
          <Field label="Name"><input className="input-field" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} /></Field>
          <Field label="Institute / Coaching"><input className="input-field" value={userForm.college} onChange={e => setUserForm({ ...userForm, college: e.target.value })} placeholder="Optional" /></Field>
          <Field label="Bio"><textarea className="input-field min-h-[110px]" value={userForm.bio} onChange={e => setUserForm({ ...userForm, bio: e.target.value })} /></Field>
        </div>

        <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
          <div className="flex items-center gap-2"><Target className="w-6 h-6 text-primary-600" /><h2 className="text-xl font-bold text-slate-900">JEE/NEET Student Profile</h2></div>
          <div className="grid md:grid-cols-2 gap-4">
            <Select label="Exam Type" value={profile.examType} onChange={v => setProfile({ ...profile, examType: v, strongSubjects: [], weakSubjects: [] })} options={['JEE', 'NEET']} />
            <Select label="Class" value={profile.classLevel} onChange={v => setProfile({ ...profile, classLevel: v })} options={['11', '12', 'Dropper']} />
            <Field label="Target Score"><input type="number" className="input-field" value={profile.targetScore} onChange={e => setProfile({ ...profile, targetScore: e.target.value })} /></Field>
            <Field label="Target Exam Date"><input type="date" className="input-field" value={profile.targetExamDate || ''} onChange={e => setProfile({ ...profile, targetExamDate: e.target.value })} /></Field>
            <Field label="Daily Available Study Hours"><input type="number" step="0.5" className="input-field" value={profile.dailyStudyHours} onChange={e => setProfile({ ...profile, dailyStudyHours: e.target.value })} /></Field>
            <Select label="Preferred Learning Language" value={profile.preferredLanguage} onChange={v => setProfile({ ...profile, preferredLanguage: v })} options={['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam']} />
            <Select label="Preparation Mode" value={profile.preparationMode} onChange={v => setProfile({ ...profile, preparationMode: v })} options={['Coaching', 'Self-study', 'Hybrid']} />
          </div>

          <SubjectPicker title="Strong Subjects" examType={profile.examType} selected={profile.strongSubjects || []} onToggle={s => toggleSubject('strongSubjects', s)} />
          <SubjectPicker title="Weak Subjects" examType={profile.examType} selected={profile.weakSubjects || []} onToggle={s => toggleSubject('weakSubjects', s)} />
        </div>
      </section>

      {message && <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100 text-primary-800">{message}</div>}
      <button disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 disabled:opacity-60">
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Profile
      </button>
    </form>
  )
}

function Field({ label, children }) { return <label className="block"><span className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</span>{children}</label> }
function Select({ label, value, onChange, options }) { return <Field label={label}><select className="input-field" value={value || ''} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></Field> }
function SubjectPicker({ title, examType, selected, onToggle }) { const subjectOptions = getSubjects(examType || 'JEE'); return <div><p className="text-sm font-semibold text-slate-700 mb-2">{title}</p><div className="flex flex-wrap gap-2">{subjectOptions.map(s => <button type="button" key={s} onClick={() => onToggle(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${selected.includes(s) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{s}</button>)}</div></div> }

export default Profile
