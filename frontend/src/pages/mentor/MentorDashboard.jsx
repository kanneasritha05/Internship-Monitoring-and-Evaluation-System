import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FaClipboardCheck, FaHourglassHalf, FaCheckDouble, 
  FaUserGraduate, FaArrowRight, FaCalendarAlt 
} from 'react-icons/fa';

export default function MentorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // ✅ FIX 1: get ONLY mentor reports
    api.get('/reports/mentor')
      .then(r => setReports(r.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ FIX 2: correct status
  const pending = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Mentor Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-rose-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/5 blur-[80px] -ml-24 -mb-24 animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Mentor <span className="bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">Overview</span>
            </h1>
            <p className="text-gray-400 text-base max-w-lg leading-relaxed font-medium">
              Welcome back, {user?.name}. You have {pending} reports awaiting your professional evaluation.
            </p>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center justify-center gap-3 bg-white text-[#07071a] px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            Review Reports <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Reports', value: reports.length, icon: <FaClipboardCheck />, color: 'from-indigo-500 to-blue-600', shadow: 'shadow-indigo-500/20' },
          { label: 'Pending Review', value: pending, icon: <FaHourglassHalf />, color: 'from-amber-400 to-orange-600', shadow: 'shadow-amber-500/20' },
          { label: 'Evaluated', value: reports.length - pending, icon: <FaCheckDouble />, color: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/20' },
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

      {/* Main Content Area */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            <FaUserGraduate className="text-indigo-400" /> Pending Student Reports
          </h2>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            Priority View <FaHourglassHalf className="text-amber-400" />
          </div>
        </div>

        <div className="space-y-4">
          {reports.filter(r => r.status === 'pending').length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <FaCheckDouble size={24} />
              </div>
              <p className="text-white font-bold text-lg">Excellent Work!</p>
              <p className="text-gray-500 text-sm">All reports have been successfully evaluated.</p>
            </div>
          ) : (
            reports.filter(r => r.status === 'pending').map(r => (
              <div key={r._id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all duration-300 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1 group-hover:text-indigo-300 transition-colors">{r.title}</h3>
                    <p className="text-gray-500 text-xs flex items-center gap-2">
                       <span className="font-bold text-gray-400">{r.student?.name}</span> · Week {r.week}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                   <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                    Awaiting Review
                  </span>
                  <button 
                    onClick={() => navigate('/reports')}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}