import { useContext, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  getLocationDetails,
  rateLocation,
  removeRating,
} from '../services/api';
import AuthContext from '../context/AuthContext';

const glossyStarStyle = {
  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 1))',
  transition: 'all 0.2s ease-in-out',
};

function renderStars(rating) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75;

  for (let i = 0; i < full; i++) {
    stars.push(
      <StarIcon
        key={`full-${i}`}
        sx={{ ...glossyStarStyle, fontSize: 24, color: '#FFD600' }}
      />
    );
  }

  if (half) {
    stars.push(
      <StarHalfIcon
        key="half"
        sx={{ ...glossyStarStyle, fontSize: 24, color: '#FFD600' }}
      />
    );
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(
      <StarBorderIcon
        key={`empty-${i}`}
        sx={{ ...glossyStarStyle, fontSize: 24, color: '#FFD600' }}
      />
    );
  }
  return stars;
}

function UserRatingStars({ locationId, userRating, onRated }) {
  const { user, token } = useContext(AuthContext) || {};
  const [hovered, setHovered] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleRate = async (value) => {
    setSubmitting(true);
    try {
      await rateLocation(locationId, value, token);
      onRated(value);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async () => {
    setSubmitting(true);
    try {
      await removeRating(locationId, token);
      onRated(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Always show 5 stars. Fill up to hovered, else up to userRating.
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, minWidth: 200 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill =
          hovered !== null
            ? star <= hovered
            : userRating
            ? star <= userRating
            : false;
        return (
          <StarIcon
            key={star}
            sx={{
              ...glossyStarStyle,
              fontSize: 24,
              color: fill ? '#1976d2' : 'transparent', // Fill color
              stroke: '#1976d2', // Border color
              strokeWidth: 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
              '&:hover': {
                transform: 'scale(1.15)',
              },
            }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => !submitting && handleRate(star)}
            data-testid={`user-star-${star}`}
          />
        );
      })}
      <Box
        component={userRating ? 'button' : 'div'}
        onClick={userRating ? handleRemove : undefined}
        disabled={submitting}
        sx={{
          ml: 2,
          color: 'rgba(255, 255, 255, 0.8)',
          background: 'none',
          border: 'none',
          cursor: userRating ? 'pointer' : 'default',
          fontWeight: 600,
          minWidth: '60px',
          textAlign: 'center',
        }}
      >
        {userRating ? 'Remove' : 'Rate'}
      </Box>
    </Box>
  );
}

export default function LocationDetails() {
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const token = auth?.token;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullViewOpen, setFullViewOpen] = useState(false);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    setLoading(true);
    getLocationDetails(id, token)
      .then((data) => {
        setLocation(data);
        setUserRating(data.user_rating || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

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
          cursor: 'pointer',
        }}
        onClick={(e) => {
          // Prevent opening image if click is on rating section
          if (e.target.closest('.rating-overlay')) return;
          setFullViewOpen(true);
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
            p: 1,
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
          className="rating-overlay"
          sx={{
            position: 'absolute',
            right: 32,
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            zIndex: 20,
            flexDirection: 'column',
            gap: 1,
            background: 'rgba(0,0,0,0.35)',
            borderRadius: 2,
            p: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderStars(location.rating)}
            <Typography
              variant="body2"
              sx={{ color: 'white', ml: 1, fontWeight: 700 }}
            >
              {location.rating.toFixed(1)}
            </Typography>
          </Box>
          <UserRatingStars
            locationId={location.id}
            userRating={userRating}
            onRated={(val) => setUserRating(val)}
          />
        </Box>
        {isFullViewOpen && (
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
            onClick={(e) => {
              e.stopPropagation();
              setFullViewOpen(false);
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
                zIndex: 1350,
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
