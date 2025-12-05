import React from 'react';
import FileUpload from './components/FileUpload';
import ShopDashboard from './components/ShopDashboard';
import { motion } from 'framer-motion';
import { Printer, LayoutDashboard } from 'lucide-react';

function App() {
  const path = window.location.pathname;

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 selection:bg-primary-500/30">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Glass Navbar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm sm:max-w-md">
        <nav className="mx-4 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-200/50 rounded-full px-2 py-2 flex justify-between items-center">
          <a
            href="/"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${path === '/'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
          >
            <Printer className="w-4 h-4" />
            Print
          </a>
          <a
            href="/shop"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${path === '/shop'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Shop
          </a>
        </nav>
      </div>

      <main className="container mx-auto px-4 pt-32 pb-12 relative z-10">
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {path === '/shop' ? <ShopDashboard /> : <FileUpload />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;
