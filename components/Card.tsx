
import React from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-sky-500/10">
      <div className="flex justify-center items-center h-12 w-12 rounded-full bg-slate-700 mx-auto mb-6 text-sky-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
};

export default Card;
