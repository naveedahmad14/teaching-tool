export default function Footer() {
  return (
    <footer 
      className="bg-[#0F3460] border-t-4 border-[#625EC6] text-center p-4 mt-auto"
      role="contentinfo"
    >
      <p className="text-[10px] text-[#B0B0B0]">
        © {new Date().getFullYear()} AlgoQuest - Master Algorithms Through Quest
      </p>
      <p className="text-[8px] text-[#625EC6] mt-2">
        ⚔️ Embark on your algorithmic journey ⚔️
      </p>
    </footer>
  );
}
