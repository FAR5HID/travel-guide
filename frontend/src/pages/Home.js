import React from 'react';

// Views
import LocationCategories from '../views/LocationCategories';
import BonVoyageSection from '../views/BonVoyageSection';

// Components
import Route from '../components/Route';

// Theme
import withRoot from '../theme/withRoot';

function Home({ auth, onAuth, onLogout }) {
  return (
    <React.Fragment>
      <Route />
      <LocationCategories />
      <BonVoyageSection />
    </React.Fragment>
  );
}

export default withRoot(Home);
