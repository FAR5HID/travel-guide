import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import ProfileMenu from '../components/ProfileMenu';
import Toolbar from '../components/Toolbar';
import AuthContext from '../context/AuthContext';

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};

function AppAppBar({ onLogout }) {
  const auth = useContext(AuthContext);
  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', fontSize: 24 }}
            aria-label="Home"
          >
            <Box
              component="img"
              src={process.env.PUBLIC_URL + '/icons/favicon.png'}
              alt="logo"
              sx={{
                width: 50,
                height: 50,
                mr: 1,
                display: 'inline-block',
                verticalAlign: 'middle',
              }}
            />
            {'travel guide'}
          </Link>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              component={RouterLink}
              to="/travel-partner"
              sx={{ ...rightLink, mr: 5 }}
              aria-label="Find Travel Partner"
            >
              {'Find Travel Partner'}
            </Link>
            {auth && auth.token ? (
              <ProfileMenu onLogout={onLogout} />
            ) : (
              <>
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  component={RouterLink}
                  to="/signin"
                  sx={rightLink}
                  aria-label="Sign In"
                >
                  {'Sign In'}
                </Link>
                <Link
                  variant="h6"
                  underline="none"
                  component={RouterLink}
                  to="/signup"
                  sx={{ ...rightLink, color: 'secondary.main' }}
                  aria-label="Sign Up"
                >
                  {'Sign Up'}
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default AppAppBar;
