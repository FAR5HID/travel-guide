import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <Link color="inherit" href="/">
        Travel Guide
      </Link>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'warning.main',
  mr: 1,
  '&:hover': {
    bgcolor: 'warning.dark',
  },
};

export default function AppFooter() {
  return (
    <Typography
      component="footer"
      sx={{ display: 'flex', bgcolor: 'secondary.light' }}
    >
      <Container sx={{ my: 8, display: 'flex' }}>
        <Grid
          container
          spacing={5}
          sx={{ justifyContent: 'space-between', width: '100%' }}
        >
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              spacing={2}
              sx={{ justifyContent: 'flex-end', height: 90 }}
            >
              <Grid item sx={{ display: 'flex' }}>
                <Box
                  component="a"
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={iconStyle}
                  aria-label="Facebook"
                >
                  <img src="/icons/appFooterFacebook.png" alt="Facebook" />
                </Box>
                <Box
                  component="a"
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={iconStyle}
                  aria-label="Twitter"
                >
                  <img src="/icons/appFooterTwitter.png" alt="Twitter" />
                </Box>
              </Grid>
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              spacing={2}
              sx={{ justifyContent: 'flex-end', height: 90 }}
            >
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Contact
                </Typography>
                <Typography variant="body2">
                  Email:{' '}
                  <Link href="mailto:info@travelguide.com">
                    info@travelguide.com
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
