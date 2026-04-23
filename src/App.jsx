import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import PostIdea from './pages/PostIdea';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Onboarding from './pages/Onboarding';
import Connections from './pages/Connections';
import HowItWorks from './pages/HowItWorks';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={
  <ProtectedRoute><Feed /></ProtectedRoute>
} />
          <Route path="/post-idea" element={
            <ProtectedRoute><PostIdea /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/chat/:connectionId" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/onboarding" element={
        <ProtectedRoute><Onboarding /></ProtectedRoute>
         } />
         <Route path="/connections" element={
  <ProtectedRoute><Connections /></ProtectedRoute>
    } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}