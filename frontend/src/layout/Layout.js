import Box from '@mui/material/Box';
import AppAppBar from '../views/AppAppBar';
import AppFooter from '../views/AppFooter';

export default function Layout({ children, onLogout }) {
  return (
    <>
      <AppAppBar onLogout={onLogout} />
      <Box
        sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ flex: 1 }}>{children}</Box>
        <AppFooter />
      </Box>
    </>
  );
}
