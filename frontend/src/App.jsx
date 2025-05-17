import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import ProfilePage from './components/ProfilePage';
import UserPage from './components/UserPage';
import ViewPosts from './components/ViewPosts';



import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Dashboard from "./Dashboard";
import ProfilePage from "./components/ProfilePage";
import UserPage from "./components/UserPage";
import LearningPlanPage from "./components/LearningPlanPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Profile Routes */}
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/Userprofile/:userId" element={<UserPage />} />
        <Route path="/user-posts/:userId" element={<ViewPosts />} />

        {/* Learning Plan Routes */}
        <Route path="/learning-plans" element={<LearningPlanPage />} />
        {/* No need for a separate route for CreateLearningPlanForm, it's inside LearningPlanPage */}
      </Routes>
    </Router>
  );
}

export default App;
