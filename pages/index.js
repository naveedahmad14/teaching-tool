import Layout from "../components/Layout";
import Card from "../components/Card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GameButton from "../components/GameButton";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-lg mb-3 text-[#FFD700]">
          ⚔️ Welcome to AlgoQuest ⚔️
        </h1>
        <p className="text-[10px] text-[#B0B0B0] leading-relaxed max-w-2xl mx-auto mb-6">
          An Interactive Web-Based Teaching Tool for Learning Data Structures and Algorithms through Visualisation and Gamification
        </p>
        {!session && (
          <div className="flex gap-4 justify-center">
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
      </div>
      
      <div className="mb-6">
        <h2 className="text-sm mb-4 text-[#FFD700] text-center">
          📚 Available Quests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            title="Bubble Sort" 
            description="Master the art of bubble sorting through interactive visualization." 
            link="/lesson/bubble" 
          />
          <Card 
            title="Merge Sort" 
            description="Learn divide and conquer with merge sort algorithm." 
            link="/lesson/merge" 
          />
          <Card 
            title="Quick Sort" 
            description="Conquer quick sort, one of the fastest sorting algorithms." 
            link="/lesson/quick" 
          />
          <Card 
            title="Linear Search" 
            description="Start your search journey with linear search technique." 
            link="/lesson/linear" 
          />
          <Card 
            title="Binary Search" 
            description="Master efficient searching with binary search algorithm." 
            link="/lesson/binary" 
          />
        </div>
      </div>
    </Layout>
  );
}
