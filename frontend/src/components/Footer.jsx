import { Link } from 'react-router-dom';
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a1f] border-t border-purple-500/10 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand/About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">InternTrack</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Internship Monitoring and Evaluation System. A comprehensive platform designed to bridge the gap between students, mentors, and administrators.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-colors">
                <FaGithub size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-colors">
                <FaLinkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-colors">
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaEnvelope className="mt-1 text-purple-500" />
                <span>support@interntrack.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaPhone className="mt-1 text-purple-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FaMapMarkerAlt className="mt-1 text-purple-500" />
                <span>University Campus, Tech Park Drive, City - 500001</span>
              </li>
            </ul>
          </div>

          {/* Newsletter/Register CTA */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">About Us</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We aim to simplify the internship lifecycle by providing real-time tracking, automated reporting, and transparent evaluation metrics.
            </p>
            <Link
              to="/register"
              className="inline-block bg-purple-600/10 border border-purple-500/20 text-purple-300 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              Join the Platform
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} InternTrack Monitoring System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
