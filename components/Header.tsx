import React from 'react';
import { ForgeIcon } from '../constants';

const Header: React.FC = () => {
  const navLinks = [
    { name: 'Arquitectura', href: '#arquitectura' },
    { name: 'Editor', href: '#editor' },
    { name: 'Stack', href: '#stack' },
    { name: 'Flujo', href: '#flujo' },
    { name: 'Plan', href: '#plan' },
    { name: 'IA', href: '#ia' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-2 text-white font-bold text-xl">
            <ForgeIcon className="w-6 h-6 text-sky-400"/>
            <span>Component Forge</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;