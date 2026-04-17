import { useNavigate } from 'react-router-dom';
import homeBg from '../assets/home_bg.png';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${homeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#07071a]/80 via-[#07071a]/60 to-[#07071a]" />
      </div>

      {/* Animated Blur Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] -top-48 -left-24 animate-pulse pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] -bottom-24 -right-12 animate-pulse pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 text-xs text-purple-300 mb-8 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span className="font-medium">Summer 2026 Batch Enrollment Open</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tight">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            InternTrack
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          A platform to track, manage, and evaluate student internships efficiently
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
          <button
            onClick={() => navigate('/login')}
            className="group relative bg-white text-[#07071a] px-10 py-4 rounded-2xl font-bold text-base hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Login
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
          </button>
          <button
            onClick={() => navigate('/register')}
            className="group bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-white/10 transition-all duration-300"
          >
            Register
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 md:gap-16 border-t border-white/5 pt-12">
          {[
            { n: '500+', l: 'Happy Interns' },
            { n: '50+', l: 'Top Mentors' },
            { n: '100%', l: 'Secure Data' },
          ].map((s) => (
            <div key={s.l} className="group">
              <div className="text-3xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">{s.n}</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
