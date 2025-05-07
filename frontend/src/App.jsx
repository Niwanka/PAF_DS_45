import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import ProfilePage from './components/ProfilePage';
import UserPage from './components/UserPage';
import LearningPlanPage from "./components/LearningPlanPage";
import CreateLearningPlanForm from "./components/CreateLearningPlanForm";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/Userprofile/:userId" element={<UserPage />} />
        <Route path="/learning-plans" element={<LearningPlanPage />} />
        <Route path="/learning-plans/create" element={<CreateLearningPlanForm />} />
      </Routes>
    </Router>
  );
}

export default App;