import React from 'react';
import '../CSS/auth.css'; // Common style for all auth pages

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-box">
        {children}
      </div>
    </div>
  );
}
