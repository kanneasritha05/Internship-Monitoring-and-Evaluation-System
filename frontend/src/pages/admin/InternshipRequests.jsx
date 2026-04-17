import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaUser, FaBuilding, FaSearch, FaFilter, FaExternalLinkAlt } from 'react-icons/fa';

export default function InternshipRequests() {
  const [internships, setInternships] = useState([]);
  const [filter, setFilter] = useState('all');
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState({});
  const [reason, setReason] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [intR, mentorR] = await Promise.all([
          api.get('/internships'),
          api.get('/auth/mentors')
        ]);
        setInternships(intR.data);
        setMentors(mentorR.data);
      } catch (err) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/internships/${id}/approve`, { mentorId: selectedMentor[id] || null });
      setInternships(prev => prev.map(i => i._id === id ? { ...i, status: 'approved', mentor: mentors.find(m => m._id === selectedMentor[id]) } : i));
      toast.success('Internship approved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    }
  };

  const reject = async (id) => {
    try {
      await api.put(`/internships/${id}/reject`, { reason: reason[id] || 'Not specified' });
      setInternships(prev => prev.map(i => i._id === id ? { ...i, status: 'rejected', rejectionReason: reason[id] } : i));
      toast.success('Internship rejected');
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  const filtered = filter === 'all' ? internships : internships.filter(i => i.status === filter);

  if (loading) return <div className="p-20 text-center text-gray-500 font-medium">Loading requests...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Internship <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Requests</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Review and manage student internship applications</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
          <FaFilter className="text-[10px]" /> Showing {filtered.length} {filter !== 'all' ? filter : ''} Applications
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.length === 0 ? (
          <div className="py-24 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <FaSearch className="text-gray-600" />
            </div>
            <p className="text-gray-500 font-medium tracking-tight">No {filter !== 'all' ? filter : ''} internship requests found</p>
          </div>
        ) : filtered.map(i => (
          <div 
            key={i._id} 
            className={`group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-300 ${
              i.status === 'pending' ? 'ring-1 ring-amber-500/10 hover:ring-amber-500/30' : ''
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="lg:w-64 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between lg:block">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white font-black text-lg">
                        <FaUser className="text-purple-500 text-xs" /> {i.student?.name}
                      </div>
                      <p className="text-gray-500 text-xs font-medium">{i.student?.email}</p>
                    </div>
                    <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border lg:block lg:text-center ${
                      i.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      i.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {i.status}
                    </div>
                  </div>
                </div>

                {i.offerLetter && (
                  <a 
                    href={`http://localhost:5000/uploads/${i.offerLetter}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors group-hover:translate-x-1 duration-300"
                  >
                    <FaExternalLinkAlt size={10} /> View Offer Letter
                  </a>
                )}
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { l: 'Company', v: i.company, ic: <FaBuilding /> },
                    { l: 'Domain', v: i.domain, ic: <FaSearch /> },
                    { l: 'Location', v: i.location, ic: <FaSearch /> },
                    { l: 'Duration', v: i.duration, ic: <FaSearch /> }
                  ].map(field => (
                    <div key={field.l} className="bg-white/5 border border-white/5 rounded-2xl p-4 transition-colors group-hover:bg-white/[0.07]">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{field.l}</p>
                      <p className="text-gray-300 text-sm font-bold truncate">{field.v}</p>
                    </div>
                  ))}
                </div>

                {i.status === 'pending' ? (
                  <div className="flex flex-col xl:flex-row gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                      <select
                        value={selectedMentor[i._id] || ''}
                        onChange={e => setSelectedMentor(prev => ({ ...prev, [i._id]: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/50 flex-1 min-w-[200px]"
                      >
                        <option value="" className="bg-[#07071a]">Assign mentor (optional)</option>
                        {mentors.map(m => <option key={m._id} value={m._id} className="bg-[#07071a]">{m.name} ({m.email})</option>)}
                      </select>
                      <button 
                        onClick={() => approve(i._id)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                      >
                        <FaCheck /> Approve
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 xl:flex-[0.8]">
                      <input
                        placeholder="Rejection reason..."
                        value={reason[i._id] || ''}
                        onChange={e => setReason(prev => ({ ...prev, [i._id]: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder-gray-600 outline-none focus:ring-2 focus:ring-rose-500/50 flex-1"
                      />
                      <button 
                        onClick={() => reject(i._id)}
                        className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 inline-flex items-center gap-4">
                    {i.status === 'approved' ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <FaCheck size={12} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Decision Processed</p>
                          <p className="text-gray-300 text-xs font-bold">Assigned Mentor: <span className="text-emerald-400">{i.mentor?.name || 'Self-Managed'}</span></p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                          <FaTimes size={12} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Decision Processed</p>
                          <p className="text-gray-300 text-xs font-bold truncate max-w-sm">Reason: <span className="text-rose-400 italic">"{i.rejectionReason || 'Not specified'}"</span></p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}