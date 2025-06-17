import React, { useState } from 'react';
import { Signup, Login, Logout } from './Auth';
import Route from './Route';

export default function Home() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });

  const handleAuth = (data) => {
    localStorage.setItem('token', data.token);
    setAuth({ token: data.token });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
  };

  if (!auth) {
    return (
      <div>
        <Signup onAuth={handleAuth} />
        <Login onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome! You are logged in.</h1>
      <Logout token={auth.token} onLogout={handleLogout} />
      <Route token={auth.token} />
    </div>
  );
}
