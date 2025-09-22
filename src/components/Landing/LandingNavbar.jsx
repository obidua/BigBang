import React, { useState, useEffect } from 'react';
import { Circle, Menu, X, Rocket, History, Zap, TrendingUp, HelpCircle, Users } from 'lucide-react';

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Home', icon: Circle },
    { id: 'evolution', label: 'Evolution', icon: History },
    { id: 'ramestta', label: 'Ramestta', icon: Zap },
    { id: 'how-it-works', label: 'How It Works', icon: Users },
    { id: 'earning', label: 'Earning', icon: TrendingUp },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsOpen(false); // Close mobile menu after clicking
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center glow-blue animate-pulse">
              <Circle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent neon-text">
              BigBang
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-blue'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Launch App Button */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg transition-all duration-300 font-medium text-sm glow-purple"
            >
              <Rocket className="w-4 h-4" />
              Launch App
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/98 backdrop-blur-md border-t border-gray-700/50">
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-blue'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
            
            {/* Mobile Launch App Button */}
            <div className="pt-4 border-t border-gray-700/50">
              <button
                onClick={() => {
                  scrollToSection('home');
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium glow-purple"
              >
                <Rocket className="w-5 h-5" />
                Launch App
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;