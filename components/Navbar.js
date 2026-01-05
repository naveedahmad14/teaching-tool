import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav className="bg-[#625EC6] text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">AlgoQuest</Link>
        <div className="flex items-center space-x-4">
          <Link href="/lessons" className="hover:underline">Lessons</Link>
          <Link href="/quiz" className="hover:underline">Quiz</Link>
          <Link href="/about" className="hover:underline">About</Link>
          
          {status === "loading" ? (
            <span className="text-sm">Loading...</span>
          ) : session ? (
            <>
              <Link href="/progress" className="hover:underline">Progress</Link>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/30">
                <div className="text-sm">
                  <span className="font-semibold">{session.user.username}</span>
                  <span className="text-white/80 ml-2">
                    Level {session.user.level}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-white/30">
              <Link
                href="/login"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-white hover:bg-white/90 text-[#625EC6] px-4 py-2 rounded text-sm font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
