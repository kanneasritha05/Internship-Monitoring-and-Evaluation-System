import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import homeBg from '../assets/home_bg.png';
import { FaGraduationCap, FaUser, FaEnvelope, FaLock, FaUsersCog, FaBuilding } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', department: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all";
  const labelClasses = "text-xs text-gray-400 font-bold uppercase tracking-wider ml-1 mb-2 block";

  return (
    <div className="relative min-h-screen py-20 flex items-center justify-center px-4 overflow-hidden">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${homeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#07071a]/95 via-[#07071a]/90 to-[#07071a]" />
      </div>

      {/* Animated Blur Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] -top-48 -right-24 animate-pulse pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px] -bottom-24 -left-12 animate-pulse pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">InternTrack<span className="text-purple-400">.</span></span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join the internship monitoring platform today</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className={labelClasses}>Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={inputClasses}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className={labelClasses}>Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={inputClasses}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className={labelClasses}>Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className={inputClasses}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className={labelClasses}>Role</label>
                <div className="relative">
                  <FaUsersCog className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option value="student" className="bg-[#0d0d22]">Student / Intern</option>
                    <option value="mentor" className="bg-[#0d0d22]">Mentor</option>
                    <option value="admin" className="bg-[#0d0d22]">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="relative">
              <label className={labelClasses}>Department</label>
              <div className="relative">
                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <select
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                  required
                >
                  <option value="" className="bg-[#0d0d22]">Select Department</option>
                  <option value="CSE" className="bg-[#0d0d22]">CSE</option>
                  <option value="CSM" className="bg-[#0d0d22]">CSM</option>
                  <option value="CSO" className="bg-[#0d0d22]">CSO</option>
                  <option value="CSN" className="bg-[#0d0d22]">CSN</option>
                  <option value="IT" className="bg-[#0d0d22]">IT</option>
                  <option value="ECE" className="bg-[#0d0d22]">ECE</option>
                  <option value="EEE" className="bg-[#0d0d22]">EEE</option>
                  <option value="MECH" className="bg-[#0d0d22]">MECH</option>
                  <option value="CIVIL" className="bg-[#0d0d22]">CIVIL</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-600/20 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}