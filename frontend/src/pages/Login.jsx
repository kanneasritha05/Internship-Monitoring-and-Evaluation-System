import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import homeBg from '../assets/home_bg.png';
import { FaGraduationCap } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
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
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] -top-24 -left-20 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[80px] -bottom-20 -right-10 animate-pulse pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">InternTrack<span className="text-purple-400">.</span></span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to continue to your dashboard</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider ml-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-600/20 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? 'Authenticating...' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              New to the platform?{' '}
              <Link to="/register" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}