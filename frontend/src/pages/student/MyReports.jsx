import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBuilding, FaCalendarAlt, FaChevronRight, FaFileAlt } from 'react-icons/fa';

export default function MyReports() {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/internships/my');
      // Filter for approved ones as per user request
      const approved = res.data.filter(i => i.status === 'approved');
      setInternships(approved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInternship = async (internship) => {
    setSelectedInternship(internship);
    setLoading(true);
    try {
      const res = await api.get(`/reports?internshipId=${internship._id}`);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading...</p>
    </div>
  );

  // VIEW 1: Internship Selection
  if (!selectedInternship) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              My <span className="text-purple-400">Internships</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Select an approved internship to view its weekly reports</p>
          </div>
          <button
            onClick={() => navigate('/submit-report')}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition shadow-lg shadow-purple-600/20"
          >
            + New Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.length === 0 ? (
            <div className="col-span-full bg-[#0d0d22] border border-dashed border-white/10 rounded-3xl py-20 text-center">
              <FaBuilding className="mx-auto text-gray-800 text-4xl mb-4" />
              <p className="text-gray-600 font-medium">No approved internships found.</p>
              <button 
                onClick={() => navigate('/my-internship')}
                className="mt-4 text-purple-400 font-bold text-xs hover:underline"
              >
                Track Internship Status →
              </button>
            </div>
          ) : (
            internships.map((i) => (
              <div 
                key={i._id}
                onClick={() => handleSelectInternship(i)}
                className="group cursor-pointer bg-[#0d0d22] border border-white/10 rounded-[2.5rem] p-6 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-black/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <FaBuilding size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg group-hover:text-purple-400 transition-colors uppercase tracking-tight">{i.company}</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{i.domain}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FaCalendarAlt className="text-purple-500/50" />
                    <span className="font-medium">{i.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-bold uppercase tracking-widest text-[9px] text-emerald-500">Approved</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">View Reports</span>
                  <FaChevronRight className="text-gray-700 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // VIEW 2: Report List for Selected Internship
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setSelectedInternship(null)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {selectedInternship.company} <span className="text-purple-400">Reports</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">{selectedInternship.domain} · {reports.length} Submissions</p>
        </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-[#0d0d22] border border-dashed border-white/10 rounded-2xl py-20 text-center">
            <FaFileAlt className="mx-auto text-gray-800 text-3xl mb-4" />
            <p className="text-gray-600 font-medium">No reports submitted for this internship yet.</p>
            <button 
                onClick={() => navigate('/submit-report')}
                className="mt-4 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-500/20 transition"
              >
                Submit Week 1 Report
              </button>
          </div>
        ) : (
          reports.map((r) => (
            <div key={r._id} className="bg-[#0d0d22] border border-white/10 rounded-3xl overflow-hidden transition-all hover:border-purple-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-purple-500/20">
                      Week {r.week}
                    </span>
                    <h3 className="text-white font-bold text-lg">{r.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Submitted {new Date(r.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-md ${
                      r.status === 'evaluated' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {r.status}
                    </span>
                    {r.documentFile && (
                      <a 
                        href={`http://localhost:5000/uploads/${r.documentFile}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        DOC
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-8 md:border-l md:border-white/5 md:pl-8">
                   <div className="text-right">
                     <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Score</p>
                     <p className={`text-xl font-black ${r.score ? 'text-purple-400' : 'text-gray-700'}`}>
                       {r.score || '—'}<span className="text-[10px] text-gray-700">/10</span>
                     </p>
                   </div>
                </div>
              </div>

              {r.status === 'evaluated' && (
                <div className="mx-6 mb-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">Mentor Feedback</p>
                  <p className="text-gray-400 text-sm leading-relaxed italic font-medium">"{r.feedback || 'No specific comments provided.'}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}