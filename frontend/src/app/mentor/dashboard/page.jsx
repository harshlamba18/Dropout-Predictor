"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// ✅ 1. Import toast
import { toast } from 'react-toastify';

// --- StudentDetailModal Component ---
const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-600">
            <p><strong>Student ID:</strong> {student.studentId}</p>
            <p><strong>Program:</strong> {student.program} (Year: {student.year})</p>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>Date of Birth:</strong> {new Date(student.dob).toLocaleDateString()}</p>
            <p><strong>Attendance:</strong> <span className="font-semibold">{student.attendance_pct}%</span></p>
            <p><strong>Average Score:</strong> <span className="font-semibold">{student.avg_score}</span></p>
            <p><strong>Guardian Contact:</strong> {student.guardian_contact}</p>
            <p><strong>Risk Level:</strong> 
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${student.risk_level === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {student.risk_level}
              </span>
            </p>
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mt-4 mb-2 text-gray-700">Weekly Scores</h3>
              <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md grid grid-cols-2 md:grid-cols-4 gap-2">
                {student.weekly_scores.map((score, idx) => (
                  <li key={idx}>Week {idx + 1}: <span className="font-semibold">{score}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main MentorDashboard Component ---
export default function MentorDashboard() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  
  // ❌ 2. The old 'message' state is removed
  // const [message, setMessage] = useState({ type: "", content: "" });

  const [mentorDetails, setMentorDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const router = useRouter();

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
        const [mentorRes, studentsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/mentor/${mentorId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:5000/api/mentor/${mentorId}/students`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!mentorRes.ok || !studentsRes.ok) throw new Error("Failed to fetch dashboard data.");
        const mentorData = await mentorRes.json();
        const studentsData = await studentsRes.json();
        setMentorDetails(mentorData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        // ✅ 3. Use toast for error notifications
        toast.error(error.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mentorId");
    toast.info("Logged Out Successfully");
    router.push("/mentor/login");
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const mentorId = localStorage.getItem("mentorId");

    try {
      const res = await fetch("http://localhost:5000/api/auth/mentor/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ studentId, password, mentorId }),
      });
      const data = await res.json();
      if (res.ok) {
        // ✅ 4. Use toast for success notifications
        toast.success(data.message || "Student added successfully!");
        setStudentId("");
        setPassword("");
        const studentsRes = await fetch(`http://localhost:5000/api/mentor/${mentorId}/students`, { headers: { Authorization: `Bearer ${token}` } });
        const updatedStudents = await studentsRes.json();
        setStudents(updatedStudents);
      } else {
        // ✅ 5. Use toast for API error notifications
        toast.error(data.message || "Failed to add student.");
      }
    } catch (err) {
      console.error("Add student error:", err);
      toast.error("A server error occurred. Please try again.");
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700">Loading Dashboard...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {mentorDetails?.name || "Mentor"}!</h1>
            <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">Logout</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                 {/* ❌ 6. The old message display is removed */}
              </form>
            </div>
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
                          <tr key={student._id} onClick={() => setSelectedStudent(student)} className="cursor-pointer hover:bg-gray-100 transition-colors">
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
      <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </>
  );
}

