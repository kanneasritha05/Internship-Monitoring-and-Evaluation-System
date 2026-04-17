import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState(null);
  const [stats, setStats] = useState({
    applied: 0,
    approved: 0,
    rejected: 0
  });

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

        // ✅ SAFE DATA HANDLING
        const data = Array.isArray(res.data) ? res.data : [];

        setInternships(data);

        // ✅ STATS CALCULATION
        const applied = data.length;
        const approved = data.filter(i => i.status === 'approved').length;
        const rejected = data.filter(i => i.status === 'rejected').length;

        setStats({ applied, approved, rejected });

      } catch (err) {
        console.error("Fetch error:", err);
        setInternships([]); // fallback to avoid crash
      }
    };

    fetchInternship();
  }, []);

  // ✅ LOADING STATE
  if (internships === null) {
    return <h2 className="text-white p-6">Loading...</h2>;
  }

  return (
    <div className="p-6">

      {/* 🔹 Welcome Section */}
      <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/30 border border-purple-500/20 rounded-2xl p-6 mb-6">
        <h1 className="text-xl font-black text-white">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here is your internship overview
        </p>
      </div>

      {/* 🔹 Submit Button */}
      <button
        onClick={() => navigate('/submit-internship')}
        className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg font-bold"
      >
        Submit Internship
      </button>

      {/* 🔹 Stats Section */}
      <div className="flex gap-4 mt-6 text-white">
        <div className="bg-gray-800 p-4 rounded-lg">Applied: {stats.applied}</div>
        <div className="bg-green-700 p-4 rounded-lg">Approved: {stats.approved}</div>
        <div className="bg-red-700 p-4 rounded-lg">Rejected: {stats.rejected}</div>
      </div>

      {/* 🔹 Internship Display Section */}
      <div className="text-white mt-6">

        {internships.length === 0 ? (
          <p>No internships yet. Please submit one.</p>
        ) : (
          internships.map((item) => (
            <div key={item._id} className="bg-gray-800 p-4 rounded-lg mb-4">

              <p><b>Company:</b> {item.company}</p>
              <p><b>Domain:</b> {item.domain}</p>

              {/* ✅ STATUS DISPLAY */}
              {item.status === 'approved' && (
                <div className="bg-green-600 text-white p-2 rounded mt-2">
                  ✅ Approved
                </div>
              )}

              {item.status === 'rejected' && (
                <div className="bg-red-600 text-white p-2 rounded mt-2">
                  ❌ Rejected <br />
                  <span className="text-sm">
                    {item.adminFeedback || 'No feedback'}
                  </span>
                </div>
              )}

              {item.status === 'pending' && (
                <div className="bg-yellow-500 text-black p-2 rounded mt-2">
                  ⏳ Pending Approval
                </div>
              )}

            </div>
          ))
        )}

      </div>

    </div>
  );
}