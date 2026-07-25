import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { GraduationCap, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/student';
  };

  const scrollToSection = (id) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slateCustom-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold font-display tracking-tight text-slateCustom-900">
              Smart Attendance <span className="text-primary font-extrabold">Pro</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-sm font-medium text-slateCustom-600 hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slateCustom-600 hover:text-primary transition-colors">Features</button>
            <button onClick={() => navigate(getDashboardPath())} className="text-sm font-medium text-slateCustom-600 hover:text-primary transition-colors">Dashboard</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-slateCustom-600 hover:text-primary transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-slateCustom-600 hover:text-primary transition-colors">Contact</button>
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slateCustom-600">
                  Hi, <strong className="font-semibold text-slateCustom-900">{user.name}</strong> ({user.role})
                </span>
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="inline-flex items-center px-4 py-2 border border-slateCustom-200 rounded-lg text-sm font-medium text-slateCustom-700 bg-white hover:bg-slateCustom-50 shadow-sm transition-all"
                >
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  Console
                </button>
                <button
                  onClick={() => {
                    logoutUser();
                    navigate('/');
                  }}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slateCustom-600 hover:text-primary transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark shadow-sm hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slateCustom-400 hover:text-slateCustom-500 hover:bg-slateCustom-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slateCustom-200 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slateCustom-700 hover:bg-slateCustom-50 hover:text-primary transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slateCustom-700 hover:bg-slateCustom-50 hover:text-primary transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate(getDashboardPath());
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slateCustom-700 hover:bg-slateCustom-50 hover:text-primary transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slateCustom-700 hover:bg-slateCustom-50 hover:text-primary transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slateCustom-700 hover:bg-slateCustom-50 hover:text-primary transition-colors"
              >
                Contact
              </button>

              <div className="pt-4 pb-2 border-t border-slateCustom-200">
                {user ? (
                  <div className="px-3 flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold text-slateCustom-900">{user.name}</div>
                      <div className="text-sm font-medium text-slateCustom-500">{user.role}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logoutUser();
                        navigate('/');
                      }}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 px-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-slateCustom-200 rounded-lg text-sm font-medium text-slateCustom-700 bg-white hover:bg-slateCustom-50 transition-all text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark shadow-sm transition-all text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
