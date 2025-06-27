import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Layout from './layout/Layout';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CategoryPage from './pages/CategoryPage';
import LocationDetails from './pages/LocationDetails';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import { getMyProfile } from './services/api';

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token, user: null } : null;
  });

  // Fetch user profile if token exists but user is not loaded
  useEffect(() => {
    if (auth && auth.token && !auth.user) {
      getMyProfile(auth.token)
        .then((user) => setAuth((prev) => ({ ...prev, user })))
        .catch(() => setAuth(null));
    }
  }, [auth?.token]);

  const handleAuth = (data) => {
    localStorage.setItem('token', data.token);
    // Fetch user profile after login
    getMyProfile(data.token)
      .then((user) => setAuth({ token: data.token, user }))
      .catch(() => setAuth({ token: data.token, user: null }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route
              path="/"
              element={
                <Home auth={auth} onAuth={handleAuth} onLogout={handleLogout} />
              }
            />
            <Route path="/signin" element={<SignIn onAuth={handleAuth} />} />
            <Route path="/signup" element={<SignUp onAuth={handleAuth} />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/location/:id" element={<LocationDetails />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
