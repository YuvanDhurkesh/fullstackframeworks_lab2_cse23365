import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HelperGallery from './components/HelperGallery';
import HelperRolePage from './components/HelperRolePage';
import Game from './components/Game';
import ToolToHelperMatchGame from './components/ToolToHelperMatchGame';
import { useHelperContext } from './context/HelperContext';

import FeedbackForm from './components/FeedbackForm';
import HelpMyCommunityForm from './components/HelpMyCommunityForm';

function App() {
  const { setHelpers } = useHelperContext();

  useEffect(() => {
    fetch('http://localhost:5000/api/helpers')
      .then((res) => res.json())
      .then((data) => setHelpers(data));
  }, [setHelpers]);

  return (
    <div className="min-h-screen bg-pastel1">
      <NavBar />
      <Routes>
        <Route path="/" element={<HelperGallery />} />
        <Route path="/helper/:id" element={<HelperRolePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/match-tools" element={<ToolToHelperMatchGame />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/help-my-community" element={<HelpMyCommunityForm />} />
      </Routes>
    </div>
  );
}

export default App;
