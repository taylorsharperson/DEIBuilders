import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import MentorRequests from './pages/MentorRequests';
import WorkshopsPage from "./pages/WorkshopsPage";
import JobMatches from "./pages/JobMatches";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/mentor-requests" element={<MentorRequests />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/job-matches" element={<JobMatches />} />
      </Routes>
    </Router>
  );
}

export default App;


