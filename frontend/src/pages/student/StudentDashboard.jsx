import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTasks, FaCheckCircle, FaChartLine, FaPlus, 
  FaClock, FaExclamationCircle, FaArrowRight 
} from 'react-icons/fa';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [evals, setEvals] = useState([]);

  useEffect(() => {
    api.get('/tasks').then(r => setTasks(r.data)).catch(() => {});
    api.get('/evaluations').then(r => setEvals(r.data)).catch(() => {});
  }, []);

  const avgScore = evals.length
    ? (evals.reduce((s, e) => s + +e.overallScore, 0) / evals.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-violet-900/30 to-indigo-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px] -ml-24 -mb-24 animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
              Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.name}</span> 👋
            </h1>
            <p className="text-gray-400 text-base max-w-lg leading-relaxed">
              Your internship journey is progressing well. Keep tracking your tasks and maintaining your momentum!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Tasks', value: tasks.length, icon: <FaTasks />, color: 'from-purple-500 to-indigo-600', shadow: 'shadow-purple-500/20' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: <FaCheckCircle />, color: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/20' },
          { label: 'Average Score', value: avgScore, icon: <FaChartLine />, color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/20' },
        ].map((s, i) => (
          <div key={i} className="group transition-all duration-300 hover:-translate-y-1">
            <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group-hover:bg-white/10 shadow-2xl ${s.shadow}`}>
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">{s.label}</div>
                <div className="text-gray-300 text-xl opacity-50">{s.icon}</div>
              </div>
              <div className="text-4xl font-black text-white">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* tasks list */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <FaClock className="text-purple-400" /> Recent Tasks
            </h2>
            <button onClick={() => navigate('/reports')} className="text-xs font-bold text-gray-500 hover:text-purple-400 transition-colors uppercase tracking-widest flex items-center gap-1.5">
              View All <FaArrowRight className="text-[10px]" />
            </button>
          </div>
          
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                <FaTasks className="text-3xl mb-4 opacity-20" />
                <p className="text-sm font-bold">No tasks assigned yet.</p>
              </div>
            ) : (
              tasks.slice(0, 5).map(task => (
                <div key={task._id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                      task.status === 'completed' ? 'bg-emerald-400 shadow-emerald-400/50' :
                      task.status === 'overdue' ? 'bg-rose-400 shadow-rose-400/50' : 'bg-amber-400 shadow-amber-400/50'
                    }`} />
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{task.title}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${
                    task.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action / Help Section */}
        <div className="flex flex-col gap-8">
          <div className="flex-1 bg-gradient-to-br from-[#1a1a3a] to-[#0d0d22] border border-white/5 rounded-[2rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/20 transition-all duration-500" />
            <h3 className="text-2xl font-black text-white mb-4">Need Assistance?</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
              Contact your mentor or browse our documentation if you encounter any difficulties during your internship.
            </p>
            <div className="flex gap-4">
              <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-xl text-xs font-bold text-white transition-all uppercase tracking-widest">
                Support Desk
              </button>
              <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                Documentation
              </button>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <FaExclamationCircle className="text-amber-400" /> System Notices
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs font-bold text-amber-300 mb-1">Final Report Deadline</p>
                <p className="text-xs text-amber-500/70 capitalize leading-relaxed">The deadline for your final internship report is May 15th, 2026.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}