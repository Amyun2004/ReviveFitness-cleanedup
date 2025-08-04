import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import logo from '../../assets/logo/RandHand.png';

export default function SignUp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    adminId: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isAdmin && !formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (formData.password !== formData.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (isAdmin && !formData.adminId.trim()) {
      setError("Admin ID is required.");
      return;
    }

    if (!isAdmin && !formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character (@#$%^&+=)");
      return;
    }

    setLoading(true);

    try {
      if (isAdmin) {
        // Admin signup logic (if you want to implement it)
        alert('Admin signup is not available. Please contact system administrator.');
        setLoading(false);
        return;
      } else {
        // Member signup
        const response = await fetch('http://localhost:8080/api/members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            joinDate: new Date().toISOString().split('T')[0],
            profilePhotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=ffcc00&color=000`
          }),
        });

        if (response.ok) {
          alert('Account created successfully! Please login to continue.');
          navigate('/login');
        } else {
          const errorData = await response.json();
          if (errorData.message && errorData.message.includes('email already exists')) {
            setError('An account with this email already exists');
          } else if (errorData.message) {
            setError(errorData.message);
          } else {
            setError('Failed to create account. Please try again.');
          }
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <img
          className="auth-logo"
          src={logo}
          alt="ReviveFitness logo"
          onClick={() => navigate('/', { replace: true })}
          style={{ cursor: 'pointer' }}
        />

        <form className="sign-in" onSubmit={handleSignup}>
          <h2>Sign Up</h2>

          {/* Admin toggle */}
          <div className="admin-toggle">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
            <label htmlFor="isAdmin">Sign up as Admin</label>
          </div>

          {/* Show name field for members */}
          {!isAdmin && (
            <>
              <p>Full Name</p>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required={!isAdmin}
              />
            </>
          )}

          {/* Conditionally show email or admin ID */}
          {isAdmin ? (
            <>
              <p>Admin ID</p>
              <input
                type="text"
                name="adminId"
                placeholder="Enter your Admin ID"
                value={formData.adminId}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <p>Email</p>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required={!isAdmin}
              />
            </>
          )}

          <p>Password</p>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isAdmin && (
            <small style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
              8+ characters with uppercase, lowercase, number & special character
            </small>
          )}

          <p>Confirm Password</p>
          <input
            type="password"
            name="confirm"
            placeholder="Confirm your password"
            value={formData.confirm}
            onChange={handleChange}
            required
          />

          {error && <div className="form-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <Link to="/login" className="other-page-link">
            Already a member?
          </Link>
          <Link to="/adminlogin" className="other-page-link">
            Login for Admin?
          </Link>
        </form>
      </div>
    </div>
  );
}