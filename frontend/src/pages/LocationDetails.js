import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getLocationDetails } from '../services/api';

function renderStars(rating) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75;
  for (let i = 0; i < full; i++)
    stars.push(<StarIcon key={i} sx={{ color: '#FFD600' }} />);
  if (half) stars.push(<StarHalfIcon key="half" sx={{ color: '#FFD600' }} />);
  for (let i = stars.length; i < 5; i++)
    stars.push(<StarBorderIcon key={i + 10} sx={{ color: '#FFD600' }} />);
  return stars;
}

export default function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false);
  const [ignoreNextHover, setIgnoreNextHover] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLocationDetails(id)
      .then((data) => {
        setLocation(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (!location) return null;

  return (
    <>
      <Box
        sx={{
          width: '100vw',
          height: { xs: 260, md: 520 },
          backgroundImage: `url(${location.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 0,
          mb: 0,
          mt: { xs: 0, md: 0 },
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          maxWidth: '100vw',
        }}
        onMouseEnter={() => {
          if (!ignoreNextHover) setHover(true);
        }}
        onMouseLeave={() => setHover(false)}
        onMouseMove={() => {
          if (ignoreNextHover) setIgnoreNextHover(false);
        }}
        tabIndex={0}
        aria-label="View full image"
      >
        <Typography
          variant="h3"
          sx={{
            position: 'absolute',
            top: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 900,
            fontSize: { xs: '2rem', md: '3.5rem' },
            color: 'transparent',
            background:
              'linear-gradient(to bottom, #fff 20%, rgba(255,255,255,0) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            zIndex: 2,
            p: 0,
            m: 0,
          }}
        >
          {location.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            left: 32,
            bottom: 32,
            color: 'white',
            fontSize: 18,
            fontWeight: 500,
            background: 'rgba(0,0,0,0.35)',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            zIndex: 2,
          }}
        >
          {location.district}
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            right: 32,
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          {renderStars(location.rating)}
          <Typography
            variant="body2"
            sx={{ color: 'white', ml: 1, fontWeight: 700 }}
          >
            {location.rating.toFixed(1)}
          </Typography>
        </Box>
        {hover && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
              background:
                'linear-gradient(120deg, rgba(31, 28, 28, 0.35) 0%, rgba(255,255,255,0.18) 100%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              transition: 'background 0.3s',
            }}
            onMouseLeave={() => setHover(false)}
            onClick={() => {
              setHover(false);
              setIgnoreNextHover(true);
            }}
            tabIndex={0}
            aria-label="Close full image"
          >
            <Box
              component="img"
              src={location.image}
              alt={location.name}
              sx={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: 3,
                boxShadow: 16,
                background: 'rgba(255,255,255,0.08)',
                opacity: 1,
                transform: 'scale(0.97)',
                transition: 'transform 0.4s cubic-bezier(.4,2,.6,1)',
                '&:hover': {
                  transform: 'scale(1.04) rotate(-1deg)',
                },
              }}
            />
          </Box>
        )}
      </Box>
      <Container
        sx={{
          position: 'relative',
          mt: { xs: -5, md: -8 },
          mb: 6,
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          borderRadius: 5,
          background: 'background.paper',
          boxShadow: 10,
          zIndex: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', fontSize: 18 }}
          component="div"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(location.description),
          }}
        />
      </Container>
    </>
  );
}
