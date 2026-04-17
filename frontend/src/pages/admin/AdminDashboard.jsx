import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  FaUsers, FaFileAlt, FaChartPie, FaHourglassHalf, 
  FaArrowRight, FaShieldAlt, FaCircle 
} from 'react-icons/fa';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [evals, setEvals] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    api.get('/reports')
      .then(r => setReports(r.data))
      .catch(err => console.log(err));

    api.get('/evaluations')
      .then(r => setEvals(r.data))
      .catch(err => console.log(err));

    api.get('/students', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(r => {
        setStudents(r.data);
      })
      .catch(err => {
        console.log("STUDENT ERROR:", err);
      });

  }, []);

  const avg = evals.length
    ? (evals.reduce((s, e) => s + +e.overallScore, 0) / evals.length).toFixed(1) : '—';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Admin Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-indigo-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 blur-[80px] -ml-24 -mb-24 animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight flex items-center gap-4">
              <FaShieldAlt className="text-rose-400" /> Admin <span className="text-purple-400">Control</span>
            </h1>
            <p className="text-gray-400 text-base max-w-lg leading-relaxed font-medium">
              System-wide oversight. Monitor student progress, review all submitted reports, and manage mentor allocations.
            </p>
          </div>
          <button
            onClick={() => navigate('/students')}
            className="flex items-center justify-center gap-3 bg-white text-[#07071a] px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            Manage Students <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: students.length, icon: <FaUsers />, color: 'from-purple-500 to-indigo-600', shadow: 'shadow-purple-500/20' },
          { label: 'Total Reports', value: reports.length, icon: <FaFileAlt />, color: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/20' },
          { label: 'Average Score', value: avg, icon: <FaChartPie />, color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/20' },
          { label: 'Pending Units', value: reports.filter(r => r.status === 'submitted').length, icon: <FaHourglassHalf />, color: 'from-amber-400 to-orange-600', shadow: 'shadow-amber-500/20' },
        ].map((s, i) => (
          <div key={i} className="group transition-all duration-300 hover:-translate-y-1">
            <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group-hover:bg-white/10 shadow-2xl ${s.shadow}`}>
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</div>
                <div className="text-gray-300 text-xl opacity-30">{s.icon}</div>
              </div>
              <div className="text-4xl font-black text-white">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
             Recent Report Submissions
          </h2>
          <button onClick={() => navigate('/reports')} className="text-xs font-bold text-gray-500 hover:text-purple-400 transition-colors uppercase tracking-widest flex items-center gap-1.5">
            Full Audit Log <FaArrowRight className="text-[10px]" />
          </button>
        </div>

        <div className="grid gap-4">
          {Array.isArray(reports) && reports.slice(0, 5).map(r => (
            <div key={r._id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all duration-300 gap-4">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <FaCircle className={`text-[10px] ${r.status === 'evaluated' ? 'text-emerald-400' : 'text-amber-400'} animate-pulse`} />
                  <div className={`absolute inset-0 ${r.status === 'evaluated' ? 'bg-emerald-400' : 'bg-amber-400'} blur-[4px] opacity-50`} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1 group-hover:text-purple-300 transition-colors">{r.title}</h3>
                  <p className="text-gray-500 text-xs font-medium">
                    <span className="text-gray-400">{r.student?.name}</span> · <span className="uppercase tracking-widest text-[10px]">Week {r.week}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto uppercase tracking-widest text-[10px] font-black">
                <span className={`px-3 py-1.5 rounded-lg border ${
                  r.status === 'evaluated' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
              No reports registered in the system.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
