import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Logo from "../ui/Logo";

const navItemClass =
  "px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0F3460]";
const navFont = { fontFamily: "'Press Start 2P', 'Courier New', monospace" };

function NavLink({ href, label, ariaLabel, current }) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={current ? "page" : undefined}
      className={`
        ${navItemClass}
        ${current
          ? "bg-[#625EC6] border-[#FFD700] text-[#FFD700] shadow-[inset_0_0_0_2px_rgba(0,0,0,0.2)]"
          : "border-[#625EC6] bg-[#16213E]/80 text-[#E8E8E8] hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-[#16213E]"
        }
      `}
      style={navFont}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { pathname } = router;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const isActive = (path) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="relative z-50 border-b-4 border-[#625EC6] bg-[#0F3460] shadow-[0_4px_0_#4A46A8,0_6px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-80" aria-hidden />

      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 sm:py-3">
          <Logo size="nav" alwaysShowRing />

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <NavLink href="/lessons" label="Quests" ariaLabel="Lessons" current={isActive("/lessons")} />
            <NavLink href="/quiz" label="Quiz" ariaLabel="Quiz" current={isActive("/quiz")} />
            <NavLink href="/flashcards" label="Cards" ariaLabel="Flashcards" current={isActive("/flashcards")} />
            <NavLink href="/about" label="Info" ariaLabel="About" current={isActive("/about")} />

            {status === "loading" ? (
              <span className={`${navItemClass} border-[#625EC6]/50 bg-[#16213E] text-[#C0C0C0]`} style={navFont} aria-live="polite">
                ...
              </span>
            ) : session ? (
              <>
                <span className="hidden sm:inline w-0.5 h-6 bg-[#625EC6] mx-0.5" aria-hidden />
                <NavLink href="/progress" label="Progress" ariaLabel="View Progress" current={isActive("/progress")} />
                <NavLink href="/review" label="Review" ariaLabel="Spaced review" current={isActive("/review")} />
                <span className="hidden sm:inline w-0.5 h-6 bg-[#625EC6] mx-0.5" aria-hidden />
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l-2 border-[#625EC6] ml-1">
                  <span
                    className={`${navItemClass} border-[#625EC6] bg-[#16213E] text-[#E8E8E8] max-w-[100px] sm:max-w-[120px] truncate normal-case`}
                    style={navFont}
                    title={session.user?.username}
                  >
                    {session.user?.username}
                  </span>
                  <span
                    className={`${navItemClass} border-[#FFD700] bg-[#16213E] text-[#FFD700] shrink-0`}
                    style={navFont}
                    aria-label={`Level ${session.user?.level ?? 1}`}
                  >
                    Lv.{session.user?.level ?? 1}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    aria-label="Sign out"
                    className={`
                      ${navItemClass}
                      border-[#625EC6] bg-[#16213E] text-[#E8E8E8]
                      hover:border-red-400 hover:bg-red-900/40 hover:text-red-200
                      cursor-pointer
                    `}
                    style={navFont}
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="hidden sm:inline w-0.5 h-6 bg-[#625EC6] mx-0.5" aria-hidden />
                <Link
                  href="/login"
                  aria-label="Sign in"
                  className={`
                    ${navItemClass}
                    border-[#625EC6] bg-[#625EC6] text-[#E8E8E8]
                    hover:border-[#FFD700] hover:text-[#FFD700]
                  `}
                  style={navFont}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  aria-label="Sign up"
                  className={`
                    ${navItemClass}
                    border-[#FFD700] bg-[#FFD700] text-[#1A1A2E]
                    hover:opacity-90 hover:border-[#FFE55C]
                  `}
                  style={navFont}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
