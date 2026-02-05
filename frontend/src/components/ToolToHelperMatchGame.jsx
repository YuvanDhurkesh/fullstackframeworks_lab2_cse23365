import React, { useState, useEffect } from 'react';
import { useHelperContext } from '../context/HelperContext';

// Tool-to-Helper Matching Game
export default function ToolToHelperMatchGame() {
  const { helpers } = useHelperContext();
  // Flatten all tools with their helper
  const allTools = helpers.flatMap(h => h.tools.map(tool => ({ tool, helper: h.name })));
  // Shuffle tools and helpers
  const [shuffledTools, setShuffledTools] = useState([]);
  const [shuffledHelpers, setShuffledHelpers] = useState([]);
  const [matches, setMatches] = useState({}); // {tool: helper}
  const [selectedTool, setSelectedTool] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    setShuffledTools(shuffleArray([...allTools]));
    setShuffledHelpers(shuffleArray([...helpers.map(h => h.name)]));
    setMatches({});
    setSelectedTool(null);
    setFeedback('');
    // eslint-disable-next-line
  }, [helpers.length]);

  function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function handleToolClick(tool) {
    setSelectedTool(tool);
    setFeedback('');
  }

  function handleHelperClick(helperName) {
    if (!selectedTool) return;
    if (selectedTool.helper === helperName) {
      setMatches(prev => ({ ...prev, [selectedTool.tool]: helperName }));
      setFeedback('Correct!');
      setScore(prev => prev + 1);
    } else {
      setFeedback('Try again!');
      setScore(prev => (prev > 0 ? prev - 1 : 0));
    }
    setSelectedTool(null);
  }

  const allMatched = Object.keys(matches).length === allTools.length;

  useEffect(() => {
    if (allMatched && score > 0) {
      if (score === allTools.length) {
        setBadge('Gold');
      } else if (score >= allTools.length - 2) {
        setBadge('Silver');
      } else {
        setBadge('Bronze');
      }
    }
  }, [allMatched, score, allTools.length]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Tool-to-Helper Matching Game</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
        {/* Tools */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Tools</h3>
          <ul className="space-y-2">
            {shuffledTools.map(({ tool, helper }) => (
              <li key={tool}>
                <button
                  className={`px-4 py-2 rounded shadow ${matches[tool] ? 'bg-green-200' : selectedTool && selectedTool.tool === tool ? 'bg-yellow-200' : 'bg-pastel2'} w-full`}
                  onClick={() => handleToolClick({ tool, helper })}
                  disabled={!!matches[tool]}
                >
                  {tool}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Helpers */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Helpers</h3>
          <ul className="space-y-2">
            {shuffledHelpers.map(helperName => (
              <li key={helperName}>
                <button
                  className={`px-4 py-2 rounded shadow w-full ${Object.values(matches).includes(helperName) ? 'bg-green-200' : 'bg-pastel2'}`}
                  onClick={() => handleHelperClick(helperName)}
                  disabled={Object.values(matches).includes(helperName)}
                >
                  {helperName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 text-center text-lg font-semibold text-blue-700">{feedback}</div>
      <div className="mt-2 text-center text-md">Score: {score}</div>
      {allMatched && (
        <div className="mt-6 text-center text-green-700 font-bold text-xl">
          Great job! You matched all tools!<br />
          {badge && (
            <div className="mt-4">
              <span className={`inline-block px-4 py-2 rounded-full text-white font-bold ${badge === 'Gold' ? 'bg-yellow-400' : badge === 'Silver' ? 'bg-gray-400' : 'bg-orange-400'}`}>{badge} Badge</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
