import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaBuilding, FaInfoCircle } from 'react-icons/fa';

export default function SubmitReport() {
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  const [form, setForm] = useState({
    week: 1,
    title: '',
    summary: '',
    selfRating: 8,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedInternships();
  }, []);

  const fetchApprovedInternships = async () => {
    try {
      const res = await api.get('/internships/my');
      const approved = res.data.filter(i => i.status === 'approved');
      setInternships(approved);
      if (approved.length > 0) {
        setSelectedInternshipId(approved[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInternshipId) {
      return toast.error('Please select an internship');
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('week', form.week);
    formData.append('title', form.title);
    formData.append('summary', form.summary);
    formData.append('selfRating', form.selfRating);
    formData.append('internship', selectedInternshipId);
    
    if (file) {
      formData.append('documentFile', file);
    }

    try {
      await api.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Report submitted successfully!');
      navigate('/reports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading...</p>
    </div>
  );

  if (internships.length === 0) return (
    <div className="max-w-xl mx-auto p-10 bg-[#0d0d22] border border-dashed border-white/10 rounded-3xl text-center space-y-4">
      <div className="w-16 h-16 bg-rose-500/10 rounded-full mx-auto flex items-center justify-center text-rose-500">
        <FaInfoCircle size={32} />
      </div>
      <h2 className="text-white font-black text-xl">Access Restricted</h2>
      <p className="text-gray-500 text-sm">You need an approved internship to submit weekly reports.</p>
      <button 
        onClick={() => navigate('/my-internship')}
        className="mt-4 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-xs"
      >
        Track Internship Status
      </button>
    </div>
  );

  const selectedInternship = internships.find(i => i._id === selectedInternshipId);

  return (
    <div className="max-w-xl animate-fadeIn">
      <h1 className="text-xl font-black text-white mb-6">
        Submit <span className="text-purple-400">Weekly Report</span>
      </h1>
      
      <div className="bg-[#0d0d22] border border-white/6 rounded-2xl p-6 space-y-6">
        {/* Internship Selection / Info */}
        <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
          <label className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-3 block">Reporting For Internship</label>
          {internships.length > 1 ? (
             <select 
              value={selectedInternshipId} 
              onChange={e => setSelectedInternshipId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
             >
               {internships.map(i => (
                 <option key={i._id} value={i._id}>{i.company} - {i.domain}</option>
               ))}
             </select>
          ) : (
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                 <FaBuilding />
               </div>
               <div>
                 <p className="text-white font-bold text-sm tracking-tight capitalize">{selectedInternship?.company}</p>
                 <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">{selectedInternship?.domain}</p>
               </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-white/5">
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Week Number</label>
            <select
              value={form.week}
              onChange={(e) => setForm({ ...form, week: +e.target.value })}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>Week {i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Report Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Completed authentication module"
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Work Summary</label>
            <textarea
              rows={4}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Describe what you worked on this week..."
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-purple-500 resize-vertical"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Upload Document (PDF/DOCX)</label>
            <div className="relative group">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="flex items-center gap-3 w-full bg-white/5 border border-white/8 border-dashed rounded-xl px-4 py-6 text-gray-500 text-sm cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-400 group-hover:text-white transition-colors">
                    {file ? file.name : 'Click to select a file'}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-600 mt-1">Maximum size: 10MB</p>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">
              Self Rating: {form.selfRating}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={form.selfRating}
              onChange={(e) => setForm({ ...form, selfRating: +e.target.value })}
              className="w-full accent-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Report →'}
          </button>
        </form>
      </div>
    </div>
  );
}