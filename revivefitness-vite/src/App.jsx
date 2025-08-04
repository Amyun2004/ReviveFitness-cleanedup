import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './CSS/global.css';
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';
import AdminProtectedRoute from './components/AdminDashbord/AdminProtectedRoute';

import Home from './Pages/Home';
import About from './Pages/AboutPage';
import Programs from './Pages/Programs';
import Contact from './Pages/Contact';
import MembershipPage from './Pages/MembershipPage';
import ProfileEditPage from './components/ProfileEdit/ProfileEditPage';

import SignUp from './components/LoginPage/SignupReviveFitness';
import Login from './components/LoginPage/login';
import AdminLogin from './components/LoginPage/AdminLogin';
import AdminDashboard from './components/AdminDashbord/AdminDashboard';

function App2() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="programs" element={<Programs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="adminlogin" element={<AdminLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App2;