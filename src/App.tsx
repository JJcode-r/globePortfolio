import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
