import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import logo from '../../assets/logo/RandHand.png';

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!adminId.trim() || !password.trim()) {
      setError("Admin ID and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId, password }),
      });

      if (response.ok) {
        const adminData = await response.json();
        
        // Store admin session
        localStorage.setItem('adminAuth', JSON.stringify({
          ...adminData,
          loginTime: new Date().toISOString()
        }));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid Admin ID or password.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <Link to="/" className="auth-logo-link">
          <img className="auth-logo" src={logo} alt="ReviveFitness_logo" />
        </Link>

        <form className="log-in-admin" onSubmit={handleAdminLogin}>
          <h2>Admin Login</h2>
          
          <p>Admin ID</p>
          <input
            type="text"
            placeholder="Enter your Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
            autoComplete="username"
          />
          
          <p>Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && <div className="form-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>

          <Link to="/login" className="other-page-link">
            Login as Member
          </Link>
          
          <Link to="/signup" className="other-page-link">
            Sign Up
          </Link>
          
          <div className="admin-note">
            <small>⚠️ Admin access only. Unauthorized access is prohibited.</small>
          </div>
        </form>
      </div>
    </div>
  );
}