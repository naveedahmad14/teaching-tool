export default function Footer() {
  return (
    <footer 
      className="bg-[#0F3460] border-t-4 border-[#625EC6] text-center p-4 mt-auto"
      role="contentinfo"
    >
      <p className="text-sm text-[#C0C0C0]">
        © {new Date().getFullYear()} AlgoQuest — Master algorithms through practice
      </p>
    </footer>
  );
}
