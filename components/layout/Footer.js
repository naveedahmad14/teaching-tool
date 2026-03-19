import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer
      className="bg-[#0F3460] border-t-4 border-[#625EC6] text-center p-4 mt-auto"
      role="contentinfo"
    >
      <div className="flex flex-col items-center gap-2">
        <Logo size="nav" link={true} alwaysShowRing className="mb-1" />
        <p className="text-sm text-[#C0C0C0]">
          © {new Date().getFullYear()} — Master algorithms through practice
        </p>
      </div>
    </footer>
  );
}
