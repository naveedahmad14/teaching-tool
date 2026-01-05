import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import GameButton from "./GameButton";
import GameBadge from "./GameBadge";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav 
      className="bg-[#0F3460] border-b-4 border-[#625EC6] shadow-lg relative z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link 
            href="/" 
            className="text-lg font-bold text-[#FFD700] hover:text-[#FFE55C] transition-colors focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
            aria-label="AlgoQuest Home"
          >
            ⚔️ AlgoQuest
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/lessons" 
              className="text-[10px] text-[#E8E8E8] hover:text-[#FFD700] transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              aria-label="Lessons"
            >
              📚 Lessons
            </Link>
            <Link 
              href="/quiz" 
              className="text-[10px] text-[#E8E8E8] hover:text-[#FFD700] transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              aria-label="Quiz"
            >
              🎯 Quiz
            </Link>
            <Link 
              href="/about" 
              className="text-[10px] text-[#E8E8E8] hover:text-[#FFD700] transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              aria-label="About"
            >
              ℹ️ About
            </Link>
            
            {status === "loading" ? (
              <span className="text-[10px] text-[#B0B0B0]" aria-live="polite">Loading...</span>
            ) : session ? (
              <>
                <Link 
                  href="/progress" 
                  className="text-[10px] text-[#E8E8E8] hover:text-[#FFD700] transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  aria-label="View Progress"
                >
                  📊 Progress
                </Link>
                <div className="flex items-center gap-3 ml-2 pl-4 border-l-2 border-[#625EC6]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#E8E8E8]" aria-label={`User: ${session.user.username}`}>
                      👤 {session.user.username}
                    </span>
                    <GameBadge variant="gold" className="text-[8px]">
                      Lv.{session.user.level}
                    </GameBadge>
                  </div>
                  <GameButton
                    onClick={handleSignOut}
                    variant="danger"
                    className="text-[8px] py-2 px-3"
                    aria-label="Sign out"
                  >
                    Exit
                  </GameButton>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-4 border-l-2 border-[#625EC6]">
                <Link
                  href="/login"
                  className="game-button text-[8px] py-2 px-3 bg-gradient-to-br from-[#625EC6] to-[#4A46A8]"
                  aria-label="Sign in"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="game-button text-[8px] py-2 px-3 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] text-[#1A1A2E]"
                  aria-label="Sign up"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
