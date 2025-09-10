"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';

// SVG Icon for the login button
const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
);

// SVG Icon for the back button
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, password, role: "student" }),
      });

      const data = await res.json();

      // Check if the response is OK AND if the token exists in the data
      if (res.ok && data.token) {
        // Save the token from the server response to local storage
        localStorage.setItem("token", data.token);
        
        router.push("/student/dashboard");
      } else {
        // Use the error message from the server
        setMessage(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error. Could not connect to the API.");
    }
  };

  return (
    <>
      <Head>
        <title>Student Login</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
        <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          
          <a href="/" className="absolute top-4 left-4 flex items-center text-gray-500 hover:text-gray-800 transition-colors">
            <BackIcon />
            Back to Roles
          </a>

          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Student Portal</h2>
            <p className="text-gray-500 text-center mb-8">Please sign in to continue.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="studentId">
                  Student ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  placeholder="e.g., S001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                <LoginIcon />
                Login
              </button>

              {message && <p className="mt-4 text-center text-red-600 text-sm">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
