import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ FIXED: moved inside component
  const [internship, setInternship] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ applied: 0,approved: 0,rejected: 0
});
  const [evals, setEvals] = useState([]);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  };

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/internship/my',
          { headers }
        );

        console.log("INTERNSHIP:", res.data);
        setInternship(res.data);
         if (res.data) {
        setStats({
          applied: 1,
          approved: res.data.status === 'approved' ? 1 : 0,
          rejected: res.data.status === 'rejected' ? 1 : 0
        });
      }

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchInternship();
  }, []);

  const avgScore = evals.length
    ? (evals.reduce((s, e) => s + +e.overallScore, 0) / evals.length).toFixed(1)
    : '—';

  // ✅ Prevent crash before data loads
  if (!internship) {
    return <h2 className="text-white p-6">Loading...</h2>;
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/30 border border-purple-500/20 rounded-2xl p-6 mb-6">
        <h1 className="text-xl font-black text-white">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here is your internship overview
        </p>
      </div>

      {/* ✅ SAFE BUTTON */}
      <button
        onClick={() => navigate('/submit-internship')}
        className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg font-bold">
        Submit Internship
      </button>

      {/* ✅ SHOW STATUS */}
      <div className="text-white mt-4">
        Status: {internship?.status}
      </div>

      {/* REST SAME */}
    </div>
  );
}