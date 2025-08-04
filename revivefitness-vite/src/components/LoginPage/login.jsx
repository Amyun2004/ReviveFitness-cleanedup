import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import logo from '../../assets/logo/RandHand.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/members/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const member = await response.json();
        localStorage.setItem('member', JSON.stringify(member));
        navigate('/membership');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <Link to="/" className="auth-logo-link">
          <img className="auth-logo" src={logo} alt="ReviveFitness_logo" />
        </Link>
        <form className="log-in" onSubmit={handleLogin}>
          <h2>Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p>Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p>Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <Link to="/signup" className="other-page-link">
            Don't have an account?
          </Link>
          <Link to="/adminlogin" className="other-page-link">
            Login as Admin
          </Link>
        </form>
      </div>
    </div>
  );
}