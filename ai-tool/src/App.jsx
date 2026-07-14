import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import Pages
import VideoFrameExtractor from './pages/VideoFrameExtractor';
import LandingPage from './pages/LandingPage';
import CreateProject from './pages/CreateProject';
import AnnotationCanvas from './pages/AnnotationCanvas';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Project from './pages/Project';
import Sss from './pages/sss';
import FigmaStyleAnnotationTool from './pages/annotation_dash';
import About from './pages/About';

// Import Components
import PrivateRoute from './components/PrivateRoute';
import StatusCard from './components/StatusCard';
import ProjectCards from './components/ProjectCards';
import SelectTeam from './components/SelectTeam';



function App() {
  return (
    <Router>
      <Routes>

        {/* Calling and declaring path Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={< Login />} />
        <Route path="/SignUp" element={< SignUp />} />
        <Route path="/about" element={< About />} />

        <Route path="/project" element={<PrivateRoute><Project /></PrivateRoute>} />
        <Route path="/CreateProject" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
        <Route path="/AnnotationCanvas" element={<PrivateRoute><AnnotationCanvas /></PrivateRoute>} />
        <Route path="/sss" element={<PrivateRoute><Sss /></PrivateRoute>} />
        <Route path="/annotate_dash/:projectName" element={<PrivateRoute><FigmaStyleAnnotationTool /></PrivateRoute>} />


        {/* Calling and declaring path Components */}
        <Route path="/StatusCard " element={<PrivateRoute><StatusCard /></PrivateRoute>} />
        <Route path="/ProjectCards " element={<PrivateRoute>< ProjectCards /></PrivateRoute>} />
        <Route path="/SelectTeam " element={<PrivateRoute>< SelectTeam /></PrivateRoute>} />
        <Route path="/VideoFrameExtractor" element={<PrivateRoute><VideoFrameExtractor /></PrivateRoute>} />


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>

  );
}

export default App;
