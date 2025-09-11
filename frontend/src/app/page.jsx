import Head from 'next/head';
import Link from 'next/link'; // Using Next.js Link for better navigation

// --- New, more detailed SVG Icons for each role ---

// A more abstract icon representing system control and oversight
const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
    </svg>
);

// Icon representing guidance and mentorship
const MentorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l15.482 0m-15.482 0L12 10.147M5.13 15.226l1.849-1.849m10.182 1.849l-1.849-1.849" />
    </svg>
);

// Icon representing learning and knowledge
const StudentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Select Your Role - AI Dropout Predictor</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">AI Dropout Predictor</h1>
          <p className="text-lg text-gray-500">Please select your role to access your portal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Admin Card */}
          <RoleCard 
            href="/admin/login" 
            icon={<AdminIcon />} 
            title="Admin" 
            description="Manage mentors and oversee the system."
            borderColor="border-blue-500"
            buttonColor="bg-blue-500 hover:bg-blue-600"
          />
          
          {/* Mentor Card */}
          <RoleCard 
            href="/mentor/login" 
            icon={<MentorIcon />} 
            title="Mentor" 
            description="View student progress and add new students."
            borderColor="border-green-500"
            buttonColor="bg-green-500 hover:bg-green-600"
          />
          
          {/* Student Card */}
          <RoleCard 
            href="/student/login" 
            icon={<StudentIcon />} 
            title="Student" 
            description="Access your dashboard and chat with the AI counsellor."
            borderColor="border-purple-500"
            buttonColor="bg-purple-500 hover:bg-purple-600"
          />
        </div>
        
      </div>
    </>
  );
}

// A reusable component for the role cards to keep the code clean
const RoleCard = ({ href, icon, title, description, borderColor, buttonColor }) => (
  <Link href={href} legacyBehavior>
    <a className={`group bg-white p-8 rounded-2xl shadow-lg border-t-4 ${borderColor} text-center transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}>
      {icon}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{description}</p>
      <div className={`inline-block text-white font-semibold py-2 px-6 rounded-lg ${buttonColor} transition-all duration-300 group-hover:scale-105`}>
        Login as {title}
      </div>
    </a>
  </Link>
);

