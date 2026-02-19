import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="bg-pastel2 p-4 rounded-b-xl shadow-md">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-gray-700 whitespace-nowrap">Community Helpers Explorer</Link>
        <div className="flex flex-wrap justify-center gap-2 w-full lg:w-auto">
          <Link to="/game" className="bg-pastel1 text-sm md:text-base rounded-full px-4 md:px-6 py-2 font-semibold shadow hover:bg-gold focus:outline-none focus:ring-2 focus:ring-gold transition">Game</Link>
          <Link to="/match-tools" className="bg-pastel1 text-sm md:text-base rounded-full px-4 md:px-6 py-2 font-semibold shadow hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition">Matching</Link>
          <Link to="/puzzle-game" className="bg-purple-300 text-sm md:text-base rounded-full px-4 md:px-6 py-2 font-semibold shadow hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">🧮 Math</Link>
          <Link to="/feedback" className="bg-pastel1 text-sm md:text-base rounded-full px-4 md:px-6 py-2 font-semibold shadow hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">Feedback</Link>
          <Link to="/help-my-community" className="bg-pastel1 text-sm md:text-base rounded-full px-4 md:px-6 py-2 font-semibold shadow hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition">Help</Link>
          <Link to="/product-description" className="bg-pastel1 text-sm md:text-base rounded-full px-4 md:px-6 py-2 font-semibold shadow hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition">About</Link>
        </div>
      </div>
    </nav>
  );
}
