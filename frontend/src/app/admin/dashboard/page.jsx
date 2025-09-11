"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

// --- A new, self-contained Modal Component for displaying mentor details ---
const MentorDetailModal = ({ mentor, onClose }) => {
  if (!mentor) return null;

  return (
    // Backdrop with blur effect
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{mentor.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3 text-gray-600">
            <p><strong>Mentor ID:</strong> {mentor.mentorId}</p>
            <p><strong>Email:</strong> {mentor.email}</p>
            <p><strong>Department:</strong> {mentor.department}</p>
            <p><strong>Year:</strong> {mentor.year}</p>
            <div>
                <strong className="block mb-1">Skills:</strong>
                <div className="flex flex-wrap gap-2">
                    {mentor.skills.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function AdminDashboard() {
  const [mentorId, setMentorId] = useState("");
  const [password, setPassword] = useState("");
  
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  
  const router = useRouter();

  const fetchMentors = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/mentor", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch mentors.");
      }

      const data = await res.json();
      setMentors(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged Out Successfully");
    router.push("/admin/login");
  };

  const handleAddMentor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/add-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ mentorId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Mentor added successfully!");
        setMentorId("");
        setPassword("");
        fetchMentors(); // Refresh the mentor list
      } else {
        toast.error(data.message || "Failed to add mentor.");
      }
    } catch (err) {
      toast.error("A server error occurred. Please try again.");
    }
  };
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <form onSubmit={handleAddMentor} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-5 text-center text-gray-700">Add New Mentor</h2>
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="mentorId">Mentor ID</label>
                  <input id="mentorId" type="text" placeholder="e.g., M001" value={mentorId} onChange={(e) => setMentorId(e.target.value)} className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="password">Set Initial Password</label>
                  <input id="password" type="password" placeholder="Create a secure password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">Add Mentor</button>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-5 text-gray-700">Existing Mentors ({mentors.length})</h2>
                {loading ? <p>Loading mentors...</p> : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mentors.map((mentor) => (
                          <tr key={mentor._id} onClick={() => setSelectedMentor(mentor)} className="cursor-pointer hover:bg-gray-100 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mentor.mentorId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mentor.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mentor.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mentor.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MentorDetailModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
    </>
  );
}

