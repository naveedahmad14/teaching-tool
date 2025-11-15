import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#625EC6] text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">AlgoQuest</Link>
        <div className="space-x-4">
          <Link href="/lessons">Lessons</Link>
          <Link href="/quiz">Quiz</Link>
          <Link href="/about">About</Link>
        </div>
      </div>
    </nav>
  );
}
