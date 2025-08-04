import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-container">  {/* your existing auth.css styling */}
      <Outlet />
    </div>
  );
}
