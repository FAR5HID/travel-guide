import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import AuthContext from '../context/AuthContext';
import Paper from '../components/Paper';
import Typography from '../components/Typography';
import { getProfile } from '../services/api';

function ProfilePage() {
  const { username } = useParams();
  const auth = useContext(AuthContext);
  const token = auth?.token;
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    getProfile(username, token)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [username, token, navigate]);

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 8,
        }}
      >
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  if (!profile)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 8,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="error"
          align="center"
          sx={{ mb: 2 }}
        >
          No user was found with the username
        </Typography>
      </Box>
    );

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        mt: 6,
        mb: 6,
        p: 4,
        borderRadius: 4,
        boxShadow: 6,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Avatar
          src={
            profile.photo || process.env.PUBLIC_URL + '/images/placeholder.png'
          }
          sx={{
            width: 180,
            height: 180,
            mb: 2,
            boxShadow: 12,
            transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
            '&:hover': {
              transform: 'scale(1.08) rotate(-2deg)',
              boxShadow: 18,
            },
            cursor: 'pointer',
          }}
        />
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          align="center"
          sx={{
            transition: 'color 0.3s',
            '&:hover': { color: 'primary.main' },
            cursor: 'pointer',
          }}
        >
          {profile.first_name} {profile.last_name}
        </Typography>
        <Chip
          label={`@${profile.username}`}
          color="primary"
          variant="outlined"
          sx={{
            mb: 1,
            transition: 'box-shadow 0.3s, color 0.3s, background 0.3s',
            boxShadow: 6,
            '&:hover': {
              boxShadow: 4,
              backgroundColor: 'primary.light',
              color: '#fff',
              '.MuiChip-label': { color: '#fff' },
            },
            cursor: 'pointer',
          }}
        />
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1 }}
          align="center"
        >
          {profile.district}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Mobile: {profile.mobile}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography
        variant="h6"
        fontWeight={600}
        gutterBottom
        color="secondary"
        align="center"
      >
        About Me
      </Typography>
      <Box
        sx={{
          minHeight: 80,
          background: '#fafbfc',
          borderRadius: 2,
          mt: 2,
          p: 1,
          boxShadow: 0,
          textAlign: 'center',
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 3, background: '#f0f4fa' },
        }}
        dangerouslySetInnerHTML={{
          __html: profile.about_me || '<i>No information provided.</i>',
        }}
      />
    </Paper>
  );
}

export default ProfilePage;
