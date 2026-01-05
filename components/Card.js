import Link from "next/link";

export default function Card({ title, description, link, completed = false }) {
  return (
    <Link 
      href={link}
      className="block focus:outline-none focus:ring-4 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#1A1A2E]"
      aria-label={`${title} lesson${completed ? " - Completed" : ""}`}
    >
      <div className="game-card p-6 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-sm leading-tight text-[#E8E8E8] group-hover:text-[#FFD700] transition-colors">
            {title}
          </h2>
          {completed && (
            <span 
              className="game-badge bg-[#4CAF50] border-[#4CAF50] flex-shrink-0 ml-2"
              aria-label="Completed"
            >
              ✓
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#B0B0B0] leading-relaxed">
          {description}
        </p>
        <div className="mt-4 text-[8px] text-[#625EC6] group-hover:text-[#FFD700] transition-colors">
          Enter Quest →
        </div>
      </div>
    </Link>
  );
}
