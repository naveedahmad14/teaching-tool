import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { getOrderedQuests } from "@/lib/questPath";

export default function Lessons() {
  const quests = getOrderedQuests();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full min-w-0">
        <header className="text-center mb-8 sm:mb-10">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#FFD700]">Quest Map</h1>
          <p className="text-base text-[#C0C0C0]">
            Follow the path. Each quest leads to the next. Recommended order below.
          </p>
        </header>

        {/* Fantasy map path: vertical spine with quest nodes */}
        <div className="relative">
          {/* Path spine (vertical line) - visible on larger screens */}
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#625EC6] via-[#7B77E8] to-[#625EC6] opacity-60 hidden md:block"
            aria-hidden
          />
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-[#625EC6]/50 hidden md:block -translate-x-px"
            aria-hidden
          />

          <ul className="space-y-0">
            {quests.map((quest, index) => (
              <li key={quest.id} className="relative flex gap-6 md:gap-8 pb-8 md:pb-10">
                {/* Path node (step marker) */}
                <div className="flex-shrink-0 flex flex-col items-center z-10">
                  <span
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0F3460] border-2 border-[#625EC6] text-[#FFD700] font-bold text-sm shadow-lg"
                    aria-hidden
                  >
                    {quest.step}
                  </span>
                </div>

                {/* Quest card */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={quest.link}
                    className="block game-card p-4 sm:p-6 cursor-pointer group focus:outline-none focus:ring-4 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#1A1A2E]"
                    aria-label={`${quest.title} quest${quest.step === 1 ? " - Start here" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`flex-shrink-0 w-9 h-9 flex items-center justify-center text-xl font-bold text-[#FFD700] bg-[#16213E] rounded-lg border border-[#625EC6]/50 group-hover:border-[#625EC6] transition-colors leading-none overflow-hidden ${quest.icon === "▀" ? "translate-y-1 translate-x-0.5" : quest.icon === "◆" ? "translate-y-0.5" : ""}`}
                          aria-hidden
                        >
                          <span className="inline-flex items-center justify-center w-full h-full leading-[0]">
                            {quest.icon}
                          </span>
                        </span>
                        <div>
                          {quest.step === 1 && (
                            <span className="inline-block text-[10px] uppercase tracking-wider text-[#FFD700] mb-0.5">
                              Start here
                            </span>
                          )}
                          <h2 className="text-lg font-bold text-[#E8E8E8] group-hover:text-[#FFD700] transition-colors leading-tight">
                            {quest.title}
                          </h2>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-[#C0C0C0] leading-relaxed mb-4">
                      {quest.description}
                    </p>

                    {quest.prerequisiteTitles.length > 0 && (
                      <p className="text-xs text-[#7B77E8] mb-3 flex items-center gap-1.5">
                        <span className="opacity-80">Recommended:</span>
                        <span>Complete {quest.prerequisiteTitles.join(" and ")} first</span>
                      </p>
                    )}

                    {quest.nextQuestTitle && quests[index + 1] && (
                      <p className="text-xs text-[#C0C0C0] mb-3">
                        Next on the path:{" "}
                        <Link
                          href={quests[index + 1].link}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#625EC6] hover:text-[#FFD700] font-medium underline focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded"
                        >
                          {quest.nextQuestTitle} →
                        </Link>
                      </p>
                    )}

                    <div className="text-sm text-[#625EC6] group-hover:text-[#FFD700] transition-colors font-medium">
                      Enter Quest →
                    </div>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Path end */}
        <div className="flex justify-center pt-4 pb-8">
          <span className="text-xs text-[#625EC6]/70 uppercase tracking-wider">End of path — you've reached the final quest</span>
        </div>
      </div>
    </Layout>
  );
}
