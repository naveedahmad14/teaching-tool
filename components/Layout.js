import Navbar from "./Navbar";
import Footer from "./Footer";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Link href="#main-content" className="skip-link">
        Skip to main content
      </Link>
      <Navbar />
      <main id="main-content" className="flex-grow container mx-auto p-6" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}