import { Routes, Route, Link, NavLink } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import VisionCheck from "./pages/VisionCheck.jsx";
import VisionTest from "./pages/VisionTest.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import InstructionManual from "./pages/InstructionManual.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Navbar() {
  const { user, signInWithGoogle, signOutUser } = useAuth(); // ✅ use the right names

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-blue-400">
          Virtual Eye Test
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/test" className="hover:text-blue-400">Test</NavLink>
          <NavLink to="/instructions" className="hover:text-blue-400">Instructions</NavLink>
          <NavLink to="/vision-check" className="hover:text-blue-400">Vision Check</NavLink>
          <NavLink to="/report" className="hover:text-blue-400">Report</NavLink>

          {!user ? (
            <button
              onClick={signInWithGoogle}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
            >
              Sign in with Google
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={user.photoURL || "https://ui-avatars.com/api/?name=U"}
                alt="avatar"
                className="h-7 w-7 rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="hidden sm:inline text-sm text-neutral-300">
                {user.displayName || user.email}
              </span>
              <button
                onClick={signOutUser}
                className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800"
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/instructions" element={<InstructionManual />} />
          <Route path="/vision-check" element={<VisionCheck />} />
          <Route path="/test" element={<VisionTest />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>
    </>
  );
}
