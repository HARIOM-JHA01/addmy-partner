import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl animate-fadeIn">
        {children}
      </main>
    </div>
  );
};

export default Layout;
