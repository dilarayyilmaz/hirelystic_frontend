import React, { useState, useEffect, useRef } from 'react';
import {
  Upload, FileText, BarChart2, CheckCircle, XCircle, User, Briefcase,
  Search, Award, ChevronRight, Loader2, BrainCircuit, ArrowLeft, Plus,
  Users, LayoutGrid, Server, LogOut, Building2, Send, AlertTriangle, X, Lock, Mail,
  ChevronDown, ChevronUp, Trophy, Filter, MapPin, Clock, ArrowRight, GraduationCap
} from 'lucide-react';

const BACKEND_API_URL = "http://localhost:8000";

const styles = `
  :root {
    --primary: #800020; /* Richer Claret Red */
    --primary-dark: #4a1819; /* Dark Claret */
    --bg-color: #f8fafc;
    --text-color: #1e293b; /* Standard text color (dark gray) */
    --text-light: #64748b;
    --border-color: #e2e8f0;
    --white: #ffffff;
    --success-bg: #f0fdf4;
    --success-text: #15803d;
    --gold: #D5B893;
    --cream-input: #FFFEFA; /* Very light cream for inputs */
  }
  html, body, #root { margin: 0; padding: 0; width: 100%; min-height: 100vh; font-family: -apple-system, sans-serif; background-color: var(--bg-color); color: var(--text-color); }
  .app-container { display: flex; flex-direction: column; min-height: 100vh; width: 100%; }
  /* Header Gradient in Claret tones */
  .header { background: linear-gradient(90deg, var(--primary-dark) 0%, var(--primary) 100%); color: var(--white); padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 50; border-bottom: 2px solid var(--gold); }
  .header-logo { display: flex; align-items: center; gap: 0.5rem; font-weight: bold; font-size: 1.25rem; color: var(--white); }
  .header-btn { background-color: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.35rem 0.85rem; border-radius: 0.35rem; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; gap: 0.25rem; }
  .header-btn:hover { background-color: var(--gold); color: var(--primary-dark); }
  .main-content { max-width: 1200px; /* Expanded for filters */ margin: 0 auto; padding: 2rem 1.5rem; width: 100%; box-sizing: border-box; flex: 1; }
  .section-title { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--primary-dark); }
  .section-subtitle { color: var(--text-light); margin-bottom: 2rem; font-size: 1rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; width: 100%; }
  .grid-cols-3 { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; align-items: start; width: 100%; }
  @media (max-width: 768px) { .grid-cols-3 { grid-template-columns: 1fr; } }
  .card { background: var(--white); border-radius: 1rem; border: 1px solid var(--border-color); padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); transition: all 0.3s ease; display: flex; flex-direction: column; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -5px rgba(99, 32, 36, 0.15); border-color: var(--primary); /* Claret border on hover */ cursor: pointer; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  
  /* Card titles are now Dark Claret */
  .card-title { font-weight: 700; font-size: 1.125rem; color: var(--primary-dark); margin: 0; }
  .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
  .badge-green { background-color: var(--success-bg); color: var(--success-text); }
  /* Warmer tone compatible with claret instead of blue badge */
  .badge-blue { background-color: #fff1f2; color: var(--primary); border: 1px solid rgba(128, 0, 32, 0.2); }
  .meta-info { font-size: 0.875rem; color: var(--text-light); display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 0.25rem; }
  .card-desc { font-size: 0.875rem; color: #475569; line-height: 1.6; margin-bottom: 1.5rem; }
  .card-footer { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
  .btn { padding: 0.6rem 1.2rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; transition: all 0.2s; }
  .btn-primary { background-color: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(128, 0, 32, 0.3); }
  .btn-primary:hover { background-color: var(--primary-dark); transform: translateY(-1px); }
  .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-light); }
  .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
  .login-wrapper { display: flex; align-items: center; justify-content: center; min-height: 100vh; width: 100%; background: linear-gradient(135deg, #f8fafc 0%, #fff1f2 100%); }
  .login-box { background: white; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(255, 214, 217, 0.88); width: 100%; max-width: 400px; padding: 2.5rem; border: 1px solid rgba(255,255,255,0.5); }
  
  /* Form Elements */
  .auth-tabs { display: flex; margin-bottom: 1.5rem; border-bottom: 2px solid #e2e8f0; }
  .auth-tab { flex: 1; padding: 1rem; text-align: center; cursor: pointer; font-weight: 600; color: #94a3b8; }
  .auth-tab.active { color: var(--primary); border-bottom: 2px solid var(--primary); margin-bottom: -2px; }
  
  .form-group { margin-bottom: 1rem; }
  .form-label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-color); }
  
  /* Input and select fields */
  .form-input, .filter-bar input, .filter-bar select { 
    width: 100%; 
    padding: 0.75rem; 
    border: 1px solid var(--border-color); 
    border-radius: 0.5rem; 
    font-size: 1rem; 
    box-sizing: border-box; 
    background-color: var(--cream-input) !important; /* Cream background */
    color: #1e293b !important; /* Dark gray text */
  }
  
  .form-input:focus, .filter-bar input:focus, .filter-bar select:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(249, 230, 235, 0.94); }
  .form-textarea { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; min-height: 100px; box-sizing: border-box; font-family: inherit; background-color: var(--cream-input) !important; color: #1e293b !important; }
  .form-textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(255, 226, 234, 0.92); }
  
  .analysis-summary { background: linear-gradient(135deg, var(--primary) 0%, #4a1819 100%); color: white; padding: 2rem; border-radius: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; position: relative; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(99, 32, 36, 0.3); }
  .score-display { font-size: 3.5rem; font-weight: 800; line-height: 1; color: var(--gold); }
  .list-item { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.2s; }
  .list-item:hover { background-color: #f8fafc; }
  ul.bullet-list { list-style-type: disc; padding-left: 1.25rem; margin: 0; color: #475569; font-size: 0.9rem; line-height: 1.5; }
  .hidden { display: none; }
  .flex-col { display: flex; flex-direction: column; }
  .flex-row { display: flex; flex-direction: row; align-items: center; }
  .gap-2 { gap: 0.5rem; }
  .w-full { width: 100%; }
  .error-banner { background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .modal-box { background: white; padding: 2rem; border-radius: 1rem; width: 100%; max-width: 500px; position: relative; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
  .close-btn { position: absolute; top: 1rem; right: 1rem; background: none; border: none; cursor: pointer; color: var(--text-light); }
  
  .accordion-header { padding: 1.25rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: white; transition: background 0.2s; }
  .accordion-header:hover { background-color: #f8fafc; }
  .accordion-content { padding: 1.5rem; border-top: 1px solid var(--border-color); background-color: #ffffff; animation: slideDown 0.3s ease-out; }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

  /* Filter Bar Style */
  .filter-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background: white; padding: 1.25rem; border-radius: 1rem; border: 1px solid #e2e8f0; margin-bottom: 2rem; align-items: end; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .filter-item { display: flex; flex-direction: column; }
  
  /* Job Detail Page Styles */
  .job-detail-container { background: white; border-radius: 1rem; border: 1px solid var(--border-color); padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .job-detail-header { border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
  /* Detail title is claret */
  .job-detail-title { font-size: 2rem; font-weight: 800; color: var(--primary-dark); margin: 0 0 0.5rem 0; }
  .job-detail-company { font-size: 1.1rem; color: var(--text-light); display: flex; align-items: center; gap: 0.5rem; }
  .job-detail-tags { display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
  .job-description-content { font-size: 1rem; line-height: 1.7; color: #334155; white-space: pre-wrap; margin-bottom: 2rem; }
`;

// SERVICE 
const HirelyticsService = {
  async register(email, password, role) {
    const res = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return await res.json();
  },

  async login(email, password) {
    const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return await res.json();
  },

  async getJobs() {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/jobs`);
      if (!response.ok) throw new Error("Data could not be fetched");
      return await response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') throw new Error('Could not connect to backend.');
      throw error;
    }
  },

  async createJob(jobData) {
    const res = await fetch(`${BACKEND_API_URL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!res.ok) throw new Error("Job posting could not be created");
    return await res.json();
  },

  async uploadCV(file, jobId, candidateInfo) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_id', jobId);
    formData.append('candidate_id', candidateInfo.uid);
    formData.append('candidate_email', candidateInfo.email);

    const response = await fetch(`${BACKEND_API_URL}/api/upload-cv`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
      throw new Error(error.detail || 'File could not be uploaded');
    }
    return await response.json();
  },

  async evaluateCandidate(jobId, candidateId, jobDescription, candidate) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          candidate_id: candidateId,
          job_description: jobDescription,
          candidate_name: candidate.name,
          cv_content: candidate.content
        })
      });
      if (!response.ok) throw new Error('Analysis failed');
      return await response.json();
    } catch (error) {
      return { isError: true, analysis: { summary: error.message } };
    }
  }
};

export default function HirelyticsApp() {
  // Auth State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hirelytics_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', role: 'candidate' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // App State
  const [jobs, setJobs] = useState([]);
  const [selJobId, setSelJobId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [uploadingJobId, setUploadingJobId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    keyword: '',  // General search
    category: '', // Job Title/Position Only
    location: '', // City
    type: '',     // Employment Type
    experience: '' // Experience Level
  });

  const [expandedJobId, setExpandedJobId] = useState(null);
  const [expandedResultId, setExpandedResultId] = useState(null);

  const [newJobForm, setNewJobForm] = useState({
    title: '', company: '', location: '', type: 'Full Time', description: ''
  });

  const fileInputRef = useRef(null);
  const activeJob = jobs.find(j => j.id === selJobId);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const data = await HirelyticsService.getJobs();
      setJobs(data);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // AUTH HANDLERS 
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'register') {
        await HirelyticsService.register(authForm.email, authForm.password, authForm.role);
        setAuthError('');
        alert("Registration successful! Please login.");
        setAuthMode('login');
      } else {
        const userData = await HirelyticsService.login(authForm.email, authForm.password);
        localStorage.setItem('hirelytics_user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('hirelytics_user');
    setUser(null);
    setSelJobId(null);
    setAuthForm({ email: '', password: '', role: 'candidate' });
    setFilters({ keyword: '', category: '', location: '', type: '', experience: '' });
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      setLoadingMsg("Creating job posting...");
      await HirelyticsService.createJob({ ...newJobForm, employer_id: user.uid });
      await fetchJobs();
      setShowJobModal(false);
      setNewJobForm({ title: '', company: '', location: '', type: 'Full Time', description: '' });
      alert("Job posting created successfully!");
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoadingMsg("");
    }
  };

  const runAnalysis = async () => {
    if (!activeJob) return;
    setIsAnalyzing(true);
    setErrorMsg('');
    setLoadingMsg("Analyzing...");
    setExpandedResultId(null);
    for (const cand of activeJob.candidates) {
      await HirelyticsService.evaluateCandidate(activeJob.id, cand.id, activeJob.description, cand);
    }
    await fetchJobs();
    setIsAnalyzing(false);
    setLoadingMsg('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingJobId) return;
    setErrorMsg('');
    setLoadingMsg(`Uploading ${file.name}...`);
    try {
      await HirelyticsService.uploadCV(file, uploadingJobId, user);
      alert(`✅ ${file.name} uploaded successfully!`);
      await fetchJobs();
    } catch (error) {
      setErrorMsg(`CV could not be uploaded: ${error.message}`);
    } finally {
      setUploadingJobId(null);
      setLoadingMsg('');
    }
  };

  const getScore = (result) => {
    return result.scores?.totalScore || result.scores?.total_score || 0;
  };

  const getSortedResults = () => {
    if (!activeJob?.analysisResults) return [];
    return [...activeJob.analysisResults].sort((a, b) => getScore(b) - getScore(a));
  };

  const sortedResults = getSortedResults();
  const topCandidate = sortedResults.length > 0 ? sortedResults[0] : null;

  const toggleResult = (index) => {
    setExpandedResultId(expandedResultId === index ? null : index);
  };

  const toggleJobDescription = (id) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  // Advanced Filtering Logic
  const filteredJobs = jobs.filter(job => {
    // 1. General Keyword
    const keywordMatch = !filters.keyword ||
      job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.keyword.toLowerCase());

    // 2. Category/Position
    const categoryMatch = !filters.category ||
      job.title.toLowerCase().includes(filters.category.toLowerCase());

    // 3. Location
    const locationMatch = !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    // 4. Employment Type
    const typeMatch = !filters.type ||
      job.type === filters.type;

    // 5. Experience
    const experienceMatch = !filters.experience ||
      job.description.toLowerCase().includes(filters.experience.toLowerCase());

    return keywordMatch && categoryMatch && locationMatch && typeMatch && experienceMatch;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* NEW JOB MODAL */}
      {showJobModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-btn" onClick={() => setShowJobModal(false)}><X size={24} /></button>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Create New Job</h2>
            <form onSubmit={handleSaveJob}>
              <div className="form-group">
                <label className="form-label">Job Title (Position)</label>
                <input className="form-input" value={newJobForm.title} onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })} required placeholder="Ex: React Developer" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Company</label>
                  <input className="form-input" value={newJobForm.company} onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })} placeholder="Ex: Hirelytics Inc." />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Location</label>
                  <input className="form-input" value={newJobForm.location} onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })} placeholder="Ex: Istanbul, Remote" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select className="form-input" value={newJobForm.type} onChange={(e) => setNewJobForm({ ...newJobForm, type: e.target.value })}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Intern">Intern</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Job Description and Requirements</label>
                <textarea className="form-textarea" value={newJobForm.description} onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })} required placeholder="Enter job details, required experience level (e.g., 3+ years, Junior, Senior) here." rows={6} />
              </div>
              <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                {loadingMsg ? <Loader2 className="animate-spin" size={20} /> : 'Post Job'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="app-container">
        {!user ? (
          /* LOGIN-REGISTER SCREEN  */
          <div className="login-wrapper">
            <div className="login-box">
              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#fff1f2', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', border: '1px solid #ffe4e6' }}>
                  <BrainCircuit size={40} color="var(--primary)" />
                </div>
                <h1 className="section-title" style={{ color: 'var(--primary)' }}>Hirelytics</h1>
                <p className="section-subtitle">AI-Powered Recruitment Platform</p>
              </div>

              <div className="auth-tabs">
                <div className={`auth-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => setAuthMode('login')}>Login</div>
                <div className={`auth-tab ${authMode === 'register' ? 'active' : ''}`} onClick={() => setAuthMode('register')}>Register</div>
              </div>

              {authError && <div className="error-banner" style={{ fontSize: '0.85rem' }}><AlertTriangle size={16} /> {authError}</div>}

              <form onSubmit={handleAuth}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', top: 12, left: 12, color: '#94a3b8' }} />
                    <input className="form-input" style={{ paddingLeft: '2.5rem' }} type="email" required
                      value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} placeholder="example@company.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', top: 12, left: 12, color: '#94a3b8' }} />
                    <input className="form-input" style={{ paddingLeft: '2.5rem' }} type="password" required
                      value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} placeholder="******" />
                  </div>
                </div>

                {authMode === 'register' && (
                  <div className="form-group">
                    <label className="form-label">Account Type</label>
                    <select className="form-input" value={authForm.role} onChange={e => setAuthForm({ ...authForm, role: e.target.value })}>
                      <option value="candidate">Job Seeker (Candidate)</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: '1rem' }} disabled={authLoading}>
                  {authLoading ? <Loader2 className="animate-spin" /> : (authMode === 'login' ? 'Login' : 'Register')}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* MAIN SCREEN (BASED ON ROLE) */
          <>
            <header className="header">
              <div className="header-logo">
                <BrainCircuit size={24} /> <span>Hirelytics</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <User size={14} /> {user.email} <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4 }}>{user.role === 'employer' ? 'Employer' : 'Candidate'}</span>
                </span>
                {user.role === 'employer' && (
                  <button onClick={() => setShowJobModal(true)} className="header-btn" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <Plus size={14} /> New Job
                  </button>
                )}
                <button onClick={logout} className="header-btn"><LogOut size={14} /> Logout</button>
              </div>
            </header>

            <main className="main-content">
              {errorMsg && <div className="error-banner"><AlertTriangle size={20} /><span>{errorMsg}</span></div>}

              {user.role === 'candidate' ? (
                /* CANDIDATE SCREEN */
                <div>
                  {!selJobId ? (
                    // 1. JOB LIST VIEW
                    <div>
                      <h2 className="section-title">Open Positions</h2>
                      <p className="section-subtitle">Find the best positions matching your career goals.</p>

                      {/* FILTER BAR */}
                      <div className="filter-bar">
                        <div className="filter-item" style={{ flex: 2 }}>
                          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Search size={14} /> Keyword</label>
                          <input
                            className="form-input"
                            placeholder="Search by company name or description..."
                            value={filters.keyword}
                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                          />
                        </div>
                        <div className="filter-item" style={{ flex: 2 }}>
                          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={14} /> Position / Title</label>
                          <input
                            className="form-input"
                            placeholder="Ex: React Developer, Architect..."
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                          />
                        </div>
                        <div className="filter-item">
                          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> City</label>
                          <input
                            className="form-input"
                            placeholder="Ex: Istanbul..."
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                          />
                        </div>
                        <div className="filter-item">
                          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GraduationCap size={14} /> Experience (Estimated)</label>
                          <select
                            className="form-input"
                            value={filters.experience}
                            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                          >
                            <option value="">Any</option>
                            <option value="Junior">Junior / New Grad</option>
                            <option value="Senior">Senior / Expert</option>
                            <option value="Year">Experienced (Years specified)</option>
                          </select>
                        </div>
                        <div className="filter-item">
                          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> Employment Type</label>
                          <select
                            className="form-input"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                          >
                            <option value="">All</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Intern">Intern</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid">
                        {filteredJobs.length === 0 && <p style={{ color: '#64748b', gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>No jobs found matching your criteria. Try changing filters.</p>}
                        {filteredJobs.map(job => (
                          // CLICKABLE CARD
                          <div key={job.id} className="card card-hover" onClick={() => setSelJobId(job.id)}>
                            <div className="card-header">
                              <h3 className="card-title">{job.title}</h3>
                              <span className="badge badge-green">{job.status || 'Active'}</span>
                            </div>
                            <div className="meta-info">
                              <span className="meta-item"><Building2 size={14} color="var(--primary)" /> {job.company}</span>
                              <span className="meta-item"><MapPin size={14} color="var(--text-light)" /> {job.location}</span>
                            </div>
                            <div className="meta-info" style={{ marginBottom: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
                              <span className="badge badge-blue">{job.type}</span>
                              <span className="meta-item" style={{ fontSize: '0.85rem', color: 'var(--primary)', marginLeft: 'auto', fontWeight: 600 }}>
                                View <ArrowRight size={16} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // 2. JOB DETAIL PAGE
                    <div>
                      <button onClick={() => setSelJobId(null)} className="btn btn-outline mb-4" style={{ border: 'none', paddingLeft: 0, color: 'var(--text-light)' }}>
                        <ArrowLeft size={16} /> Back to Jobs
                      </button>

                      {activeJob && (
                        <div className="job-detail-container">
                          <div className="job-detail-header">
                            <h1 className="job-detail-title">{activeJob.title}</h1>
                            <div className="job-detail-company">
                              <Building2 size={20} color="var(--primary)" /> {activeJob.company} &bull; <MapPin size={18} /> {activeJob.location}
                            </div>
                            <div className="job-detail-tags">
                              <span className="badge badge-blue" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>{activeJob.type}</span>
                              <span className="badge badge-green" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>Active Job</span>
                              <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.9rem' }}>
                                <Users size={16} /> {activeJob.candidates ? activeJob.candidates.length : 0} applications
                              </span>
                            </div>
                          </div>

                          <div className="job-description-content">
                            <strong style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--primary-dark)' }}>Job Description and Requirements</strong>
                            {activeJob.description}
                          </div>

                          <div style={{ background: '#fff1f2', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(128,0,32,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '3rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>Apply for this Position</h3>
                            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>Please upload your current CV (.pdf or .docx format).</p>

                            <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
                              <button
                                onClick={() => {
                                  setUploadingJobId(activeJob.id);
                                  setTimeout(() => fileInputRef.current?.click(), 100);
                                }}
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                                disabled={uploadingJobId === activeJob.id}
                              >
                                {uploadingJobId === activeJob.id ? <><Loader2 size={20} className="animate-spin" /> Uploading...</> : <><Send size={20} /> Upload CV and Apply</>}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /*  EMPLOYER SCREEN */
                <div>
                  {!selJobId ? (
                    <div>
                      <h2 className="section-title">My Jobs</h2>
                      <div className="grid">
                        {jobs.length === 0 && <div className="card">No jobs yet. Create a 'New Job' from top right.</div>}
                        {jobs.map(job => (
                          <div key={job.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div
                              className="accordion-header"
                              onClick={() => toggleJobDescription(job.id)}
                              style={{ borderBottom: expandedJobId === job.id ? '1px solid #e2e8f0' : 'none' }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                  <h3 className="card-title">{job.title}</h3>
                                  <span className="badge badge-blue">{job.type}</span>
                                </div>
                                <div className="meta-info" style={{ marginBottom: 0 }}>
                                  <span className="meta-item"><Users size={14} /> {job.candidates ? job.candidates.length : 0} Applications</span>
                                  {job.analysisResults && job.analysisResults.length > 0 && <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: '0.5rem' }}><CheckCircle size={10} /> Analyzed</span>}
                                </div>
                              </div>
                              <div style={{ marginLeft: '1rem' }}>
                                {expandedJobId === job.id ? <ChevronUp size={20} color="var(--text-light)" /> : <ChevronDown size={20} color="var(--text-light)" />}
                              </div>
                            </div>

                            {expandedJobId === job.id && (
                              <div className="accordion-content" style={{ backgroundColor: '#fdfdfd' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Job Description:</strong>
                                  <p className="card-desc" style={{ marginBottom: 0 }}>{job.description}</p>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelJobId(job.id); }}
                                  className="btn btn-primary w-full"
                                  style={{ justifyContent: 'center' }}
                                >
                                  <Users size={16} /> Manage & Analyze Applications
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /*  DETAIL / ANALYSIS SCREEN  */
                    <div>
                      <button onClick={() => setSelJobId(null)} className="btn btn-outline mb-4" style={{ border: 'none', paddingLeft: 0, color: 'var(--text-light)' }}><ArrowLeft size={16} /> Back to List</button>
                      <div className="grid-cols-3">
                        <div className="card" style={{ padding: 0, overflow: 'hidden', maxHeight: '80vh' }}>
                          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: 'var(--primary-dark)' }}>Applications ({activeJob.candidates ? activeJob.candidates.length : 0})</div>
                          <div style={{ overflowY: 'auto', flex: 1 }}>
                            {(!activeJob.candidates || activeJob.candidates.length === 0) && <div style={{ padding: '1rem', color: 'var(--text-light)' }}>No applications yet.</div>}
                            {activeJob.candidates && activeJob.candidates.map(c => (
                              <div key={c.id} className="list-item">
                                <div><div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{c.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{c.email || 'No email'}</div></div>
                                {c.analysis_result && <CheckCircle size={14} color="var(--success-text)" />}
                              </div>
                            ))}
                          </div>
                          <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <button onClick={runAnalysis} disabled={isAnalyzing || !activeJob.candidates || activeJob.candidates.length === 0} className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
                              {isAnalyzing ? <><Loader2 size={16} className="animate-spin" /> {loadingMsg}</> : <><Server size={16} /> Start Analysis</>}
                            </button>
                          </div>
                        </div>

                        <div className="flex-col gap-4">
                          {topCandidate && !isAnalyzing && (
                            <div className="analysis-summary" style={{ marginBottom: '1.5rem', cursor: 'default' }}>
                              <div>
                                <div style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                                  <Trophy size={16} style={{ display: 'inline', marginBottom: -2 }} /> Top Candidate
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{topCandidate.candidateName}</div>
                              </div>
                              <div className="score-display">{getScore(topCandidate)}</div>
                            </div>
                          )}

                          {sortedResults.map((res, index) => (
                            <div key={index} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                              <div
                                className="accordion-header"
                                onClick={() => toggleResult(index)}
                                style={{ backgroundColor: expandedResultId === index ? '#fff1f2' : 'white' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{res.candidateName}</div>
                                  <span className={`badge ${getScore(res) >= 70 ? 'badge-green' : 'badge-blue'}`}>
                                    Score: {getScore(res)}
                                  </span>
                                </div>
                                <div>
                                  {expandedResultId === index ? <ChevronUp size={20} color="var(--text-light)" /> : <ChevronDown size={20} color="var(--text-light)" />}
                                </div>
                              </div>

                              {expandedResultId === index && (
                                <div className="accordion-content">
                                  <p style={{ margin: '0 0 1.5rem 0', fontStyle: 'italic', color: 'var(--text-light)', lineHeight: '1.6' }}>
                                    "{res.analysis.summary}"
                                  </p>

                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                                    <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #dcfce7' }}>
                                      <div style={{ color: 'var(--success-text)', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <CheckCircle size={16} /> Strengths
                                      </div>
                                      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#166534' }}>
                                        {res.analysis.strengths?.map((s, k) => <li key={k} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                                      </ul>
                                    </div>

                                    <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>
                                      <div style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <XCircle size={16} /> Areas for Improvement
                                      </div>
                                      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#991b1b' }}>
                                        {res.analysis.missingSkills?.map((s, k) => <li key={k} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {!activeJob.analysisResults?.length && activeJob.candidates?.length > 0 && !isAnalyzing && (
                            <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                              <p>Analysis not performed yet.</p>
                              <p style={{ fontSize: '0.9rem' }}>Click the 'Start Analysis' button on the left.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </>
        )}
      </div>
    </>
  );
}