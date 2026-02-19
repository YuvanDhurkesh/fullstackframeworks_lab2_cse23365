import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HelperGallery from './components/HelperGallery';
import HelperRolePage from './components/HelperRolePage';
import Game from './components/Game';
import ToolToHelperMatchGame from './components/ToolToHelperMatchGame';
import PuzzleGame from './components/PuzzleGame';
import ErrorBoundary from './components/ErrorBoundary';
import { useHelperContext } from './context/HelperContext';

import FeedbackForm from './components/FeedbackForm';
import HelpMyCommunityForm from './components/HelpMyCommunityForm';

import ProductDescription from './components/ProductDescription';

function App() {
  const { setHelpers } = useHelperContext();

  useEffect(() => {
    fetch('http://localhost:5001/api/helpers')
      .then((res) => res.json())
      .then((data) => setHelpers(data))
      .catch((err) => console.error('Error loading helpers:', err));
  }, [setHelpers]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-pastel1">
        <NavBar />
        <Routes>
          <Route path="/" element={<HelperGallery />} />
          <Route path="/helper/:id" element={<HelperRolePage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/match-tools" element={<ToolToHelperMatchGame />} />
          <Route path="/puzzle-game" element={<PuzzleGame />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/help-my-community" element={<HelpMyCommunityForm />} />
          <Route path="/product-description" element={<ProductDescription />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
