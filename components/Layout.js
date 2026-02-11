import Navbar from "./Navbar";
import Footer from "./Footer";
import Link from "next/link";
import AnimatedBackground from "./common/AnimatedBackground";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Link href="#main-content" className="skip-link">
          Skip to main content
        </Link>
        <Navbar />
        <main id="main-content" className="flex-grow container mx-auto p-6" role="main">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}