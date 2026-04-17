import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function SubmitInternship() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    company: '',
    domain: '',
    location: '',
    duration: ''
  });

  // ✅ Fetch all internships for this student
  useEffect(() => {
    api.get('/internships/my')
      .then(res => setInternships(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ✅ Submit internship
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/internships', form);
      toast.success('Internship submitted successfully!');
      setForm({ company: '', domain: '', location: '', duration: '' });
      setShowForm(false);
      // Re-fetch
      const res = await api.get('/internships/my');
      setInternships(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white">
          Manage <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Internships</span>
        </h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20"
        >
          {showForm ? 'Cancel' : '+ Post New Internship'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 animate-fadeIn">
          <h2 className="text-xl font-bold text-white mb-6">New Internship Details</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Company Name"
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:ring-2 focus:ring-purple-500/50"
              required
            />
            <input
              placeholder="Domain (e.g. Web Development)"
              value={form.domain}
              onChange={e => setForm({ ...form, domain: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:ring-2 focus:ring-purple-500/50"
              required
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:ring-2 focus:ring-purple-500/50"
              required
            />
            <input
              placeholder="Duration"
              value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none focus:ring-2 focus:ring-purple-500/50"
              required
            />
            <button
              type="submit"
              className="md:col-span-2 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-purple-600/20 hover:scale-[1.01] transition-all"
            >
              Submit Internship Request
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest px-1">My Submissions ({internships.length})</h3>
        {internships.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
             <p className="text-gray-500 font-medium">No internships posted yet. Get started by posting your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {internships.map(i => (
              <div key={i._id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.07] transition-all">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">{i.company}</h4>
                  <div className="flex gap-4 text-xs text-gray-400 font-medium">
                    <span>Domain: {i.domain}</span>
                    <span>•</span>
                    <span>{i.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      i.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      i.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {i.status}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase">Status</p>
                  </div>
                  {i.mentor && (
                    <div className="border-l border-white/5 pl-6">
                      <p className="text-white font-bold text-xs">{i.mentor.name}</p>
                      <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-1">Assigned Mentor</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}