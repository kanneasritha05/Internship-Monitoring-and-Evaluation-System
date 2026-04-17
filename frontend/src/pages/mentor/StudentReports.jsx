import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaUser, FaChartLine, FaChevronRight, FaFileAlt, FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaDownload, FaStar, FaSave } from 'react-icons/fa';

export default function StudentReports() {
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Evaluation States
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(8);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students/my-students');
      setAssignedStudents(res.data);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setLoading(true);
    try {
      const res = await api.get(`/reports/mentor?studentId=${student.user._id}`);
      setReports(res.data);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = (r) => {
    setSelectedReport(r);
    setFeedback(r.feedback || '');
    setScore(r.score || 8);
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return toast.error('Please provide feedback');
    
    setSubmitting(true);
    try {
      await api.put(`/reports/${selectedReport._id}/evaluate`, { score, feedback });
      toast.success('Evaluation saved!');
      
      // Update local state
      setReports(prev => prev.map(r => r._id === selectedReport._id ? { ...r, status: 'evaluated', score, feedback } : r));
      setSelectedReport(null);
      setFeedback('');
    } catch (err) {
      toast.error('Failed to save evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
      <div className="w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
        <FaChartLine className="text-purple-500 text-2xl" />
      </div>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Records...</p>
    </div>
  );

  // VIEW 1: STUDENT SELECTION
  if (!selectedStudent) return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Submitted <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Reports</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Select a student to review their weekly progress and performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedStudents.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
            <FaUser className="mx-auto text-gray-700 text-3xl mb-4" />
            <p className="text-gray-500 font-bold">No students assigned to you yet</p>
          </div>
        ) : assignedStudents.map((s) => (
          <div 
            key={s._id}
            onClick={() => handleSelectStudent(s)}
            className="group cursor-pointer bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                <FaUser className="text-purple-400 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-black text-lg leading-tight group-hover:text-purple-400 transition-colors uppercase tracking-tight">{s.user?.name}</h3>
                <p className="text-gray-500 text-xs font-bold truncate max-w-[150px]">{s.user?.email}</p>
              </div>
              <FaChevronRight className="text-gray-700 group-hover:text-purple-400 transition-colors translate-x-0 group-hover:translate-x-1 duration-300" />
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Domain</p>
                <p className="text-gray-300 text-[11px] font-bold">{s.internshipDomain || 'Full Stack'}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Status</p>
                <p className="text-emerald-400 text-[11px] font-black uppercase tracking-widest">Active</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // VIEW 2: STUDENT REPORTS TIMELINE
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSelectedStudent(null)}
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all hover:-translate-x-1 active:scale-90"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">
              {selectedStudent.user?.name}
            </h1>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5"><FaUser className="text-[10px] text-purple-400" /> Member since {new Date(selectedStudent.createdAt).getFullYear()}</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>{reports.length} Reports Submitted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Timeline (Left) */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Weekly Submission Timeline</h2>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                <p className="text-gray-500 italic font-medium text-sm">Waiting for student to submit their first report...</p>
              </div>
            ) : reports.map((r) => (
              <div 
                key={r._id}
                onClick={() => handleSelectReport(r)}
                className={`group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-[2rem] p-6 transition-all cursor-pointer ${
                  selectedReport?._id === r._id ? 'ring-2 ring-purple-500/50 bg-white/[0.06]' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-lg">Week {r.week}</span>
                          <h3 className="text-white font-bold text-lg">{r.title}</h3>
                        </div>
                        <p className="text-gray-500 text-xs font-medium">Submitted on {new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                        r.status === 'evaluated' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {r.status === 'evaluated' ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                        {r.status}
                      </div>
                    </div>
                  </div>
                  
                  {r.score && (
                    <div className="md:w-20 text-center border-l border-white/5 pl-4 flex flex-col items-center gap-1">
                       <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Score</p>
                       <p className="text-purple-400 text-xl font-black">{r.score}<span className="text-[10px] text-gray-600">/10</span></p>
                    </div>
                  )}
                  
                  <div className="hidden md:block">
                    <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Detail Panel (Right Side, or floating) */}
        {selectedReport && (
          <div className="lg:col-span-12 xl:col-span-4 animate-slideInRight">
            <div className="sticky top-24 bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-3xl shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Review Week {selectedReport.week}</h2>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center hover:text-white transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Work Summary</p>
                <div className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {selectedReport.summary || 'No summary provided.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedReport.documentFile && (
                  <a 
                    href={`http://localhost:5000/uploads/${selectedReport.documentFile}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl group/link hover:bg-blue-500/20 transition-all"
                  >
                    <FaDownload className="text-blue-400" />
                    <p className="text-[10px] font-black text-blue-400 uppercase">Documents</p>
                  </a>
                )}
                {selectedReport.link && (
                  <a 
                    href={selectedReport.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col gap-2 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl group/link hover:bg-purple-500/20 transition-all"
                  >
                    <FaFileAlt className="text-purple-400" />
                    <p className="text-[10px] font-black text-purple-400 uppercase">External Link</p>
                  </a>
                )}
              </div>

              {/* Feedback Form */}
              <div className="pt-8 border-t border-white/10 space-y-6">
                <form onSubmit={handleEvaluate} className="space-y-6">
                   <div className="space-y-3">
                    <label className="flex items-center justify-between text-[11px] text-gray-400 font-black uppercase tracking-widest px-1">
                      <span>Performance Score</span>
                      <span className="text-purple-400 text-lg">{score}<span className="text-[10px] text-gray-600 uppercase">/10</span></span>
                    </label>
                    <input 
                      type="range" min="1" max="10" step="0.5"
                      value={score}
                      onChange={e => setScore(e.target.value)}
                      className="w-full accent-purple-600 h-1.5 bg-white/10 rounded-full cursor-pointer"
                    />
                    <div className="flex justify-between px-1">
                      <FaStar className="text-gray-800 text-[10px]" />
                      <FaStar className="text-gray-800 text-[10px]" />
                      <FaStar className="text-gray-800 text-[10px]" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] text-gray-400 font-black uppercase tracking-widest px-1">Mentor Feedback</label>
                    <textarea 
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="Write your observations and guidance here..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm placeholder-gray-700 h-32 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                      required
                    />
                  </div>

                  <button 
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Processing...' : (
                      <>
                        <FaSave /> Commit Evaluation
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}