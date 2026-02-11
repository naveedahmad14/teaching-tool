import Layout from "../components/Layout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GameButton from "../components/GameButton";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold mb-4 text-[#FFD700]">
          Welcome to AlgoQuest
        </h1>
        <p className="text-base text-[#E8E8E8] leading-relaxed max-w-2xl mx-auto mb-8">
          An interactive teaching tool for learning data structures and algorithms through visualisation and gamification.
        </p>
        {!session && (
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <GameButton variant="gold" aria-label="Start your quest">
                Begin Quest
              </GameButton>
            </Link>
            <Link href="/login">
              <GameButton variant="primary" aria-label="Sign in">
                Sign In
              </GameButton>
            </Link>
          </div>
        )}
        <div className="mt-10">
          <Link
            href="/lessons"
            className="inline-block text-base text-[#625EC6] hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#1A1A2E] rounded px-4 py-2"
            aria-label="View all lessons and quests"
          >
            View all quests →
          </Link>
        </div>
      </div>
    </Layout>
  );
}
