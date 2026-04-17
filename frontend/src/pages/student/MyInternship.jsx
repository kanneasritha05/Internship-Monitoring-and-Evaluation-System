import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaUserTie, FaChevronRight } from 'react-icons/fa';

export default function MyInternship() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/internships/my')
      .then(r => setInternships(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-500 font-medium">Loading your profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            My <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Internships</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Track and manage your professional experiences</p>
        </div>
        
        {internships.length > 0 && (
          <button
            onClick={() => navigate('/submit-internship')}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            + Add Another
          </button>
        )}
      </div>

      {internships.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] py-20 px-10 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full flex items-center justify-center mx-auto">
            <FaBuilding className="text-purple-400 text-3xl" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">No Internships Yet</h2>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">You haven't submitted any internship applications yet. Start your journey by posting your first one!</p>
          </div>
          <button
            onClick={() => navigate('/submit-internship')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-purple-600/20 hover:scale-105 transition-all active:scale-95"
          >
            Submit Internship Details →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {internships.map((internship) => {
            const isApproved = internship.status === 'approved';
            const isRejected = internship.status === 'rejected';
            
            return (
              <div 
                key={internship._id} 
                className="group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-[2rem] p-8 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Side: Basic Info */}
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-white">{internship.company}</h3>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                            isApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            isRejected ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {internship.status}
                          </span>
                        </div>
                        <p className="text-purple-400 font-bold text-sm tracking-wide">{internship.domain}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Location</p>
                        <div className="flex items-center gap-2 text-white/80 font-bold text-sm">
                          <FaMapMarkerAlt className="text-gray-600 text-xs" />
                          {internship.location}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Duration</p>
                        <div className="flex items-center gap-2 text-white/80 font-bold text-sm">
                          <FaCalendarAlt className="text-gray-600 text-xs" />
                          {internship.duration}
                        </div>
                      </div>
                      {internship.mentor && (
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Mentor</p>
                          <div className="flex items-center gap-2 text-white/80 font-bold text-sm">
                            <FaUserTie className="text-purple-400/80 text-xs" />
                            {internship.mentor.name}
                          </div>
                        </div>
                      )}
                    </div>

                    {internship.adminFeedback && (
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Feedback</p>
                        <p className="text-gray-300 text-sm italic font-medium">"{internship.adminFeedback}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Action */}
                  <div className="md:w-48 flex items-center justify-center md:border-l md:border-white/5 md:pl-8">
                    {isApproved ? (
                      <button
                        onClick={() => navigate('/submit-report')}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Submit Report <FaChevronRight />
                      </button>
                    ) : (
                      <div className="text-center">
                        <div className="text-gray-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Actions Locked</div>
                        <p className="text-gray-500 text-[10px] font-medium leading-relaxed">Wait for admin approval to start reporting</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}