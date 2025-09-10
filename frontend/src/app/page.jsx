import Head from 'next/head';

// SVG Icons for the buttons
const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const MentorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
    </svg>
);

const StudentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);


export default function Home() {
  return (
    <>
      <Head>
        <title>Select Your Role</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg text-center transform transition-all hover:scale-105 duration-500">
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome!</h1>
          <p className="text-gray-500 mb-8">Please select your role to continue.</p>

          <div className="flex flex-col gap-5">
            <a href="/admin/login" className="flex items-center justify-center px-6 py-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <AdminIcon />
              <span className="font-semibold text-lg">Admin</span>
            </a>
            
            <a href="/mentor/login" className="flex items-center justify-center px-6 py-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <MentorIcon />
              <span className="font-semibold text-lg">Mentor</span>
            </a>

            <a href="/student/login" className="flex items-center justify-center px-6 py-4 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <StudentIcon />
              <span className="font-semibold text-lg">Student</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
