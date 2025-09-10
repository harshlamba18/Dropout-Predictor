"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MentorDashboard() {
  // Form state
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });

  // Data state
  const [mentorDetails, setMentorDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch all necessary data on component load
  useEffect(() => {
    const mentorId = localStorage.getItem("mentorId");
    const token = localStorage.getItem("token");

    if (!mentorId || !token) {
      router.push("/mentor/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch mentor details and student list in parallel
        const [mentorRes, studentsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/mentor/${mentorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/mentor/${mentorId}/students`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!mentorRes.ok || !studentsRes.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const mentorData = await mentorRes.json();
        const studentsData = await studentsRes.json();

        setMentorDetails(mentorData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setMessage({ type: "error", content: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mentorId");
    router.push("/mentor/login");
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    const token = localStorage.getItem("token");
    const mentorId = localStorage.getItem("mentorId");

    try {
      const res = await fetch("http://localhost:5000/api/auth/mentor/add-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId, password, mentorId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", content: data.message });
        setStudentId("");
        setPassword("");
        // Refresh the student list after adding a new one
        const studentsRes = await fetch(`http://localhost:5000/api/mentor/${mentorId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedStudents = await studentsRes.json();
        setStudents(updatedStudents);
      } else {
        setMessage({ type: "error", content: data.message || "Failed to add student." });
      }
    } catch (err) {
      console.error("Add student error:", err);
      setMessage({ type: "error", content: "Server error. Please try again later." });
    }
  };
  
  const messageColor = message.type === "success" ? "text-green-600" : "text-red-600";

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {mentorDetails?.name || "Mentor"}!
          </h1>
          <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Add Student */}
          <div className="lg:col-span-1 space-y-8">
            {mentorDetails && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">My Profile</h2>
                <div className="space-y-2 text-gray-600">
                  <p><strong>ID:</strong> {mentorDetails.mentorId}</p>
                  <p><strong>Email:</strong> {mentorDetails.email}</p>
                  <p><strong>Department:</strong> {mentorDetails.department}</p>
                  <p><strong>Skills:</strong> {mentorDetails.skills.join(", ")}</p>
                </div>
              </div>
            )}
            <form onSubmit={handleAddStudent} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-5 text-center text-gray-700">Add New Student</h2>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="studentId">Student ID</label>
                <input id="studentId" type="text" placeholder="e.g., S002" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full text-black p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="password">Set Initial Password</label>
                <input id="password" type="password" placeholder="Create a temporary password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-black p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" required />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">Add Student</button>
              {message.content && <p className={`mt-4 text-center text-sm ${messageColor}`}>{message.content}</p>}
            </form>
          </div>

          {/* Right Column: Student List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-5 text-gray-700">My Students ({students.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.program}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                            <span className={student.risk_level === 'High' ? 'text-red-500' : student.risk_level === 'Medium' ? 'text-yellow-500' : 'text-green-500'}>
                              {student.risk_level}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-gray-500">You have not added any students yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

