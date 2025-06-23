import React from 'react';

// Views
import LocationCategories from '../views/LocationCategories';
import BonVoyageSection from '../views/BonVoyageSection';
import AppFooter from '../views/AppFooter';
import AppAppBar from '../views/AppAppBar';

// Components
import Route from '../components/Route';

// Theme
import withRoot from '../theme/withRoot';

function Home({ auth, onAuth, onLogout }) {
  return (
    <React.Fragment>
      <AppAppBar auth={auth} onLogout={onLogout} />
      <Route />
      <LocationCategories />
      <BonVoyageSection />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Home);
