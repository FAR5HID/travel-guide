import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home auth={auth} onAuth={handleAuth} onLogout={handleLogout} />} />
        <Route path="/signin" element={<SignIn onAuth={handleAuth} />} />
        <Route path="/signup" element={<SignUp onAuth={handleAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;
