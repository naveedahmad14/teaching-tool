import Link from "next/link";

export default function Card({ title, description, link, icon, completed = false }) {
  return (
    <Link 
      href={link}
      className="block focus:outline-none focus:ring-4 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#1A1A2E]"
      aria-label={`${title} lesson${completed ? " - Completed" : ""}`}
    >
      <div className="game-card p-6 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl font-bold text-[#FFD700] bg-[#16213E] rounded-lg border border-[#625EC6]/50 group-hover:border-[#625EC6] transition-colors leading-none overflow-hidden" aria-hidden>
                <span
                  className={`inline-flex items-center justify-center leading-[0] w-full h-full ${
                    icon === "▀" ? "translate-y-1 translate-x-0.5" : icon === "◆" ? "translate-y-0.5" : ""
                  }`}
                >
                  {icon}
                </span>
              </span>
            )}
            <h2 className="text-base font-bold leading-tight text-[#E8E8E8] group-hover:text-[#FFD700] transition-colors">
              {title}
            </h2>
          </div>
          {completed && (
            <span 
              className="game-badge bg-[#4CAF50] border-[#4CAF50] flex-shrink-0 ml-2 text-xs"
              aria-label="Completed"
            >
              ✓
            </span>
          )}
        </div>
        <p className="text-sm text-[#C0C0C0] leading-relaxed">
          {description}
        </p>
        <div className="mt-4 text-sm text-[#625EC6] group-hover:text-[#FFD700] transition-colors">
          Enter Quest →
        </div>
      </div>
    </Link>
  );
}
