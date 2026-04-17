import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FaUserGraduate, FaEnvelope, FaLaptopCode, FaUniversity, FaCircle } from 'react-icons/fa';

export default function MyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/my-students')
      .then(r => setStudents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-500 font-medium">Loading your students...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          My <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Students</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Manage and monitor students under your mentorship</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                {[
                  { l: 'Student Info', ic: <FaUserGraduate /> },
                  { l: 'Domain', ic: <FaLaptopCode /> },
                  { l: 'University', ic: <FaUniversity /> },
                  { l: 'Status', ic: <FaCircle size={8} /> }
                ].map(h => (
                  <th key={h.l} className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                       <span className="opacity-50">{h.ic}</span> {h.l}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FaUserGraduate className="text-gray-700 text-4xl mb-2" />
                      <p className="text-white font-bold text-lg">No Students Allotted</p>
                      <p className="text-gray-500 text-sm">Once the admin assigns students to you, they will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-indigo-400 font-bold group-hover:scale-110 transition-transform">
                          {s.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm tracking-wide">{s.user?.name}</div>
                          <div className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">
                            <FaEnvelope className="text-[10px]" /> {s.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-indigo-400 font-bold text-xs tracking-wider">{s.internshipDomain || 'Not Set'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-gray-300 font-medium text-sm">{s.college || 'N/A'}</div>
                      <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">{s.department || 'General'}</div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        s.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        s.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'approved' ? 'bg-emerald-400' : s.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}