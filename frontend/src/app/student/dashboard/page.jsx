"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentChat from "@/components/StudentChat"; 
// ✅ 1. Import Recharts components
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Icon Components ---
const StudentProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

// --- Helper function to parse JWT ---
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// --- Main Dashboard Component ---
export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // --- Data Fetching ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/student/login");
      return;
    }
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.studentId) {
      localStorage.removeItem("token");
      router.push("/student/login");
      return;
    }
    const studentId = decodedToken.studentId;

    fetch(`http://localhost:5000/api/student/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch student data');
        return res.json();
      })
      .then((data) => setStudentData(data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setMessage(err.message);
      });
  }, [router]);

  // --- Event Handlers ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/student/login");
  };

  // --- Loading and Error States ---
  if (!studentData) return <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700">Loading Student Data...</div>;
  if (message) return <p className="m-6 text-center text-red-600">{message}</p>;
  
  // Prepare data for the charts
  const weeklyScoresData = studentData.weekly_scores.map((score, index) => ({
    name: `Week ${index + 1}`,
    score: score,
  }));

  // ✅ FIX: Data for the new Attendance Pie Chart
  const attendanceData = [
    { name: 'Present', value: studentData.attendance_pct },
    { name: 'Absent', value: 100 - studentData.attendance_pct },
  ];
  const ATTENDANCE_COLORS = ['#82ca9d', '#ff8042']; // Green for Present, Orange for Absent


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Welcome, {studentData.name}!
          </h1>
          <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-600 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Student Details & Chat */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80">
                <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center gap-3"><StudentProfileIcon /> My Details</h2>
                <div className="space-y-3 text-gray-600">
                    <p><strong>Student ID:</strong> {studentData.studentId}</p>
                    <p><strong>Program:</strong> {studentData.program} (Year: {studentData.year})</p>
                    <p><strong>Attendance:</strong> <span className="font-semibold">{studentData.attendance_pct}%</span></p>
                    <p><strong>Fee Status:</strong> <span className="font-semibold text-blue-600">{studentData.fee_status}</span> (Due: ₹{studentData.fee_due_amount})</p>
                    <p><strong>Risk Level:</strong> 
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${studentData.risk_level === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{studentData.risk_level}</span>
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200/80">
              <StudentChat token={localStorage.getItem("token")} studentName={studentData.name} />
            </div>
          </div>

          {/* Right Column: Charts and Visualizations */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 flex items-center gap-3"><ChartIcon /> Weekly Performance</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={weeklyScoresData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="score" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* ✅ FIX: Updated Pie Chart for Attendance */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 flex items-center gap-3"><ChartIcon /> Attendance Overview</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={attendanceData} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {attendanceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

