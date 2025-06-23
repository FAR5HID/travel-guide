import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};

function AppAppBar({ auth, onLogout }) {
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
            sx={{ fontSize: 24 }}
            aria-label="Home"
          >
            {'travel guide'}
          </Link>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {!auth ? (
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
            ) : (
              <Link
                variant="h6"
                underline="none"
                onClick={onLogout}
                component="button"
                sx={{ ...rightLink, color: 'secondary.main' }}
                aria-label="Logout"
              >
                {'Logout'}
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default AppAppBar;
