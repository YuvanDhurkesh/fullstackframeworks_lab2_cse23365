import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="bg-pastel2 p-4 flex justify-between items-center rounded-b-xl shadow-md">
      <Link to="/" className="text-2xl font-bold text-gray-700">Community Helpers Explorer</Link>
      <div>
        <Link to="/game" className="bg-pastel1 text-lg rounded-full px-6 py-2 mx-2 font-semibold shadow hover:bg-gold focus:outline-none focus:ring-2 focus:ring-gold transition">Game</Link>
        <Link to="/match-tools" className="bg-pastel1 text-lg rounded-full px-6 py-2 mx-2 font-semibold shadow hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition">Matching Game</Link>
        <Link to="/feedback" className="bg-pastel1 text-lg rounded-full px-6 py-2 mx-2 font-semibold shadow hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">Feedback</Link>
        <Link to="/help-my-community" className="bg-pastel1 text-lg rounded-full px-6 py-2 mx-2 font-semibold shadow hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition">Help My Community</Link>
      </div>
    </nav>
  );
}
