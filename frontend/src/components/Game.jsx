import React, { useState, useEffect } from 'react';
import { useHelperContext } from '../context/HelperContext';

const positiveAudio = new Audio('/audio/great-job.mp3'); // Placeholder path

export default function Game() {
  const { helpers, user, setUser } = useHelperContext();
  const [tool, setTool] = useState('');
  const [helperId, setHelperId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [tick, setTick] = useState(false);

  // Pick a random helper and tool
  useEffect(() => {
    if (helpers.length) {
      const randomHelper = helpers[Math.floor(Math.random() * helpers.length)];
      setHelperId(randomHelper._id);
      setTool(randomHelper.tools[Math.floor(Math.random() * randomHelper.tools.length)]);
      setFeedback('');
      setTick(false);
    }
  }, [helpers]);

  const handleMatch = (id) => {
    if (id === helperId) {
      setFeedback('Correct!');
      setTick(true);
      // positiveAudio.play(); // Optionally play sound
      setUser({ ...user, starsEarned: user.starsEarned + 1 });
      setTimeout(() => {
        setTick(false);
        setFeedback('');
        // Next round
        const randomHelper = helpers[Math.floor(Math.random() * helpers.length)];
        setHelperId(randomHelper._id);
        setTool(randomHelper.tools[Math.floor(Math.random() * randomHelper.tools.length)]);
      }, 1200);
    } else {
      setFeedback('Try again!');
    }
  };

  if (!helpers.length) return <div className="p-6 text-center">Loading game...</div>;

  // Badge logic
  let badge = null;
  if (user.starsEarned >= 20) badge = <span className="inline-block bg-yellow-400 text-white px-4 py-1 rounded-full font-bold text-lg mx-2">🥇 Gold Badge</span>;
  else if (user.starsEarned >= 10) badge = <span className="inline-block bg-gray-400 text-white px-4 py-1 rounded-full font-bold text-lg mx-2">🥈 Silver Badge</span>;
  else if (user.starsEarned >= 5) badge = <span className="inline-block bg-orange-400 text-white px-4 py-1 rounded-full font-bold text-lg mx-2">🥉 Bronze Badge</span>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-pastel1 rounded-xl shadow-lg mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Match the Tool!</h2>
      <div className="mb-2 text-lg">Which helper uses: <span className="font-semibold">{tool}</span>?</div>
      <div className="mb-2">Points: <span className="font-bold">{user.starsEarned}</span> {badge}</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {helpers.map((h) => (
          <button
            key={h._id}
            onClick={() => handleMatch(h._id)}
            className="bg-pastel2 rounded-xl px-4 py-4 shadow hover:bg-gold focus:outline-none focus:ring-2 focus:ring-gold text-lg"
          >
            <img src={h.image} alt={h.name} className="w-20 h-20 mx-auto rounded-full object-cover mb-2" />
            {h.name}
          </button>
        ))}
      </div>
      {tick && <div className="text-5xl mb-2 text-green-500">✔️</div>}
      <div className="text-xl font-bold text-gold">{feedback}</div>
    </div>
  );
}
