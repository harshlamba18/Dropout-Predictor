"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [mentorId, setMentorId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  
  // State for the list of mentors
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true); // To show a loading indicator
  
  const router = useRouter();

  // Function to fetch all mentors from the backend
  const fetchMentors = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/mentor", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch mentors.");
      }

      const data = await res.json();
      setMentors(data);
    } catch (err) {
      setMessage({ type: "error", content: err.message });
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch mentors when the component mounts
  useEffect(() => {
    fetchMentors();
    // The empty dependency array [] means this effect runs once on mount.
    // The router is stable and doesn't need to be in the dependency array
    // if you are using Next.js 13+ App Router.
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const handleAddMentor = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/add-mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ mentorId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", content: data.message || "Mentor added successfully!" });
        setMentorId("");
        setPassword("");
        // Refresh the mentor list after adding a new one
        fetchMentors(); 
      } else {
        setMessage({ type: "error", content: data.message || "Failed to add mentor." });
      }
    } catch (err) {
      console.error("Add mentor error:", err);
      setMessage({ type: "error", content: "Server error. Please try again later." });
    }
  };
  
  const messageColor = message.type === 'success' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Mentor Form (Left Column) */}
          <div className="lg:col-span-1">
            <form onSubmit={handleAddMentor} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-5 text-center text-gray-700">Add New Mentor</h2>
              {/* Form inputs... */}
              <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="mentorId">Mentor ID</label>
                  <input id="mentorId" type="text" placeholder="e.g., M001" value={mentorId} onChange={(e) => setMentorId(e.target.value)} className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div className="mb-6">
                  <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="password">Set Initial Password</label>
                  <input id="password" type="password" placeholder="Create a secure password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">Add Mentor</button>
              {message.content && <p className={`mt-4 text-center text-sm ${messageColor}`}>{message.content}</p>}
            </form>
          </div>

          {/* Existing Mentors List (Right Column) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-5 text-gray-700">Existing Mentors</h2>
              {loading ? (
                <p>Loading mentors...</p>
              ) : (
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
                        <tr key={mentor._id}>
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
  );
}

