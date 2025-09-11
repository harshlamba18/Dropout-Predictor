"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';
import { toast } from 'react-toastify';

// --- SVG Icons ---
const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
);
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);


export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, password, role: "student" }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Logged In Successfully");
        router.push("/student/dashboard");
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Server error. Could not connect to the API.");
    }
  };

  return (
    <>
      <Head>
        <title>Student Login</title>
      </Head>
      <div className="relative flex items-center justify-center min-h-screen w-full bg-slate-50 overflow-hidden p-6">
          <div 
              className="absolute inset-0 -z-10 h-full w-full" 
              style={{
                  background: 'radial-gradient(circle at 10% 20%, rgb(229, 218, 244) 0%, rgba(255,255,255,0) 25%), radial-gradient(circle at 80% 90%, rgb(233, 218, 244) 0%, rgba(255,255,255,0) 25%)'
              }}
          ></div>
        <div className="relative bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-purple-500">
          
          <a href="/" className="absolute top-4 left-4 flex items-center text-gray-500 hover:text-gray-800 transition-colors z-20">
            <BackIcon />
            Back to Roles
          </a>

          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Student Portal</h2>
            <p className="text-gray-500 text-center mb-8">Please sign in to continue.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="studentId">
                  Student ID
                </label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-8 pointer-events-none">
                    <UserIcon />
                </div>
                <input
                  id="studentId"
                  type="text"
                  placeholder="e.g., S001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="text-black w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="password">
                  Password
                </label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-8 pointer-events-none">
                    <LockIcon />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-black w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <LoginIcon />
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

