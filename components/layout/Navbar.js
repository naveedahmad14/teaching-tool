import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Logo from "../ui/Logo";

const navItemClass =
  "px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0F3460]";
const navFont = { fontFamily: "'Press Start 2P', 'Courier New', monospace" };

function NavLink({ href, label, ariaLabel, current, onNavigate, className = "" }) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
      className={`
        ${navItemClass}
        ${className}
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

function NavAuthSection({
  status,
  session,
  isActive,
  onNavigate,
  mobile,
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    onNavigate?.();
    await signOut({ redirect: false });
    router.push("/");
  };

  const stackClass = mobile ? "flex flex-col gap-2 w-full" : "flex flex-wrap items-center gap-1.5 sm:gap-2";
  const userRowClass = mobile
    ? "flex flex-col gap-2 w-full border-l-0 border-t-2 border-[#625EC6] pt-2 mt-1 pl-0 ml-0"
    : "flex flex-wrap items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l-2 border-[#625EC6] ml-1";

  if (status === "loading") {
    return (
      <span
        className={`${navItemClass} border-[#625EC6]/50 bg-[#16213E] text-[#C0C0C0] ${mobile ? "w-full text-center" : ""}`}
        style={navFont}
        aria-live="polite"
      >
        ...
      </span>
    );
  }

  if (session) {
    return (
      <>
        {!mobile && <span className="hidden sm:inline w-0.5 h-6 bg-[#625EC6] mx-0.5" aria-hidden />}
        <div className={stackClass}>
          <NavLink
            href="/progress"
            label="Progress"
            ariaLabel="View Progress"
            current={isActive("/progress")}
            onNavigate={onNavigate}
            className={mobile ? "w-full text-center justify-center inline-flex" : ""}
          />
          <NavLink
            href="/review"
            label="Review"
            ariaLabel="Spaced review"
            current={isActive("/review")}
            onNavigate={onNavigate}
            className={mobile ? "w-full text-center justify-center inline-flex" : ""}
          />
        </div>
        {!mobile && <span className="hidden sm:inline w-0.5 h-6 bg-[#625EC6] mx-0.5" aria-hidden />}
        <div className={userRowClass}>
          <span
            className={`${navItemClass} border-[#625EC6] bg-[#16213E] text-[#E8E8E8] ${mobile ? "max-w-none w-full text-center truncate normal-case" : "max-w-[100px] sm:max-w-[120px] truncate normal-case"}`}
            style={navFont}
            title={session.user?.username}
          >
            {session.user?.username}
          </span>
          <span
            className={`${navItemClass} border-[#FFD700] bg-[#16213E] text-[#FFD700] shrink-0 ${mobile ? "w-full text-center" : ""}`}
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
              ${mobile ? "w-full" : ""}
            `}
            style={navFont}
          >
            Log out
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {!mobile && <span className="hidden sm:inline w-0.5 h-6 bg-[#625EC6] mx-0.5" aria-hidden />}
      <Link
        href="/login"
        aria-label="Sign in"
        onClick={onNavigate}
        className={`
          ${navItemClass}
          border-[#625EC6] bg-[#625EC6] text-[#E8E8E8]
          hover:border-[#FFD700] hover:text-[#FFD700]
          ${mobile ? "w-full text-center inline-flex justify-center" : ""}
        `}
        style={navFont}
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        aria-label="Sign up"
        onClick={onNavigate}
        className={`
          ${navItemClass}
          border-[#FFD700] bg-[#FFD700] text-[#1A1A2E]
          hover:opacity-90 hover:border-[#FFE55C]
          ${mobile ? "w-full text-center inline-flex justify-center" : ""}
        `}
        style={navFont}
      >
        Sign Up
      </Link>
    </>
  );
}

function PrimaryNavLinks({ isActive, onNavigate, mobile }) {
  const col = mobile ? "w-full flex flex-col gap-2" : "flex flex-wrap items-center gap-1.5 sm:gap-2";
  return (
    <div className={col}>
      <NavLink
        href="/lessons"
        label="Quests"
        ariaLabel="Lessons"
        current={isActive("/lessons")}
        onNavigate={onNavigate}
        className={mobile ? "w-full text-center justify-center inline-flex" : ""}
      />
      <NavLink
        href="/quiz"
        label="Quiz"
        ariaLabel="Quiz"
        current={isActive("/quiz")}
        onNavigate={onNavigate}
        className={mobile ? "w-full text-center justify-center inline-flex" : ""}
      />
      <NavLink
        href="/flashcards"
        label="Cards"
        ariaLabel="Flashcards"
        current={isActive("/flashcards")}
        onNavigate={onNavigate}
        className={mobile ? "w-full text-center justify-center inline-flex" : ""}
      />
      <NavLink
        href="/about"
        label="Info"
        ariaLabel="About"
        current={isActive("/about")}
        onNavigate={onNavigate}
        className={mobile ? "w-full text-center justify-center inline-flex" : ""}
      />
    </div>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { pathname } = router;
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onRouteDone = () => setMenuOpen(false);
    router.events.on("routeChangeComplete", onRouteDone);
    return () => router.events.off("routeChangeComplete", onRouteDone);
  }, [router.events]);

  const isActive = (path) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="relative z-50 border-b-4 border-[#625EC6] bg-[#0F3460] shadow-[0_4px_0_#4A46A8,0_6px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-80" aria-hidden />

      <div className="container mx-auto px-3 sm:px-4 max-w-full">
        <div className="flex flex-nowrap items-center justify-between gap-2 py-2 sm:py-3">
          <Logo size="nav" alwaysShowRing />

          <button
            type="button"
            className="md:hidden shrink-0 px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 border-[#FFD700] bg-[#16213E] text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0F3460]"
            style={navFont}
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          <div className="hidden md:flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 min-w-0">
            <PrimaryNavLinks isActive={isActive} />
            <NavAuthSection status={status} session={session} isActive={isActive} />
          </div>
        </div>

        {menuOpen ? (
          <div
            id="nav-mobile-panel"
            className="md:hidden border-t-2 border-[#625EC6]/80 py-3 px-1 flex flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <PrimaryNavLinks isActive={isActive} onNavigate={closeMenu} mobile />
            <NavAuthSection
              status={status}
              session={session}
              isActive={isActive}
              onNavigate={closeMenu}
              mobile
            />
          </div>
        ) : null}
      </div>
    </nav>
  );
}
