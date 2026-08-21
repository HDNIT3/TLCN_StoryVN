import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 font-sans selection:bg-amber-700 selection:text-white flex flex-col relative">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl rounded-full bg-amber-550/5 bg-amber-500/5 blur-[120px] pointer-events-none"></div>
      
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
