import Link from "next/link";

const LOGO_STYLE = {
  fontFamily: "'Press Start 2P', 'Courier New', monospace",
  textShadow: "3px 3px 0 #4A46A8, 2px 2px 0 rgba(0,0,0,0.5)",
};

const SIZES = {
  nav: "text-lg sm:text-xl",
  default: "text-xl sm:text-2xl",
  hero: "text-2xl sm:text-3xl",
};

/**
 * AlgoQuest logo/brand — use everywhere for consistency.
 * @param {string} size - "nav" | "default" | "hero"
 * @param {boolean} link - wrap in Link to "/" (default true)
 * @param {boolean} inline - if true, render only "AlgoQuest" (no icon, same font/color) for use in headings/sentences
 * @param {boolean} alwaysShowRing - if true, link always has the gold ring (e.g. navbar home button)
 * @param {string} className - extra classes
 */
export default function Logo({ size = "default", link = true, inline = false, alwaysShowRing = false, className = "" }) {
  const sizeClass = SIZES[size] ?? SIZES.default;
  const content = inline ? (
    <span className={`text-[#FFD700] font-bold ${sizeClass} ${className}`} style={LOGO_STYLE}>
      AlgoQuest
    </span>
  ) : (
    <span className={`text-[#FFD700] font-bold leading-none ${sizeClass} ${className}`} style={LOGO_STYLE}>
      ◆ AlgoQuest
    </span>
  );

  if (link && !inline) {
    const linkClass = [
      "inline-flex items-center py-1.5 px-2 -ml-2 rounded-sm focus:outline-none focus:ring-4 focus:ring-[#FFD700]",
      alwaysShowRing ? "ring-4 ring-[#FFD700]" : "",
    ].filter(Boolean).join(" ");
    return (
      <Link
        href="/"
        className={linkClass}
        aria-label="AlgoQuest Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
