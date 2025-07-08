import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import { CATEGORIES } from '../constants/options';
import { getLocationsByCategory } from '../services/api';

const getCategoryImage = (category) => {
  const images = {
    [CATEGORIES[0]]: '/images/Dorianagar.jpg',
    [CATEGORIES[1]]: '/images/Bandarban.jpg',
    [CATEGORIES[2]]: '/images/Amiakhum.png',
    [CATEGORIES[3]]: '/images/Saint_Martin.jpg',
    [CATEGORIES[4]]: '/images/Kaptai_Lake.jpg',
    [CATEGORIES[6]]: '/images/Kris_Taung_2.jpg',
    [CATEGORIES[7]]: '/images/Dulahazara_Safari_Park.jpg',
    [CATEGORIES[8]]: '/images/Shalban_Bihar.jpg',
    [CATEGORIES[9]]: '/images/Chandranath_1.jpg',
  };
  return images[category] || '/images/placeholder.png';
};

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryImage = getCategoryImage(categoryName);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getLocationsByCategory(categoryName)
      .then((data) => {
        setLocations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryName]);

  return (
    <>
      <Box
        sx={{
          width: '100vw',
          height: { xs: 180, md: 440 },
          backgroundImage: `url(${categoryImage})`,
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
      >
        <Typography
          variant="h3"
          sx={{
            position: 'absolute',
            left: 42,
            bottom: 32,
            fontWeight: 900,
            fontSize: { xs: '2rem', md: '3.5rem' },
            color: 'transparent',
            background:
              'linear-gradient(to bottom, #fff 20%, rgba(255,255,255,0) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            zIndex: 1,
            p: 1,
            m: 0,
          }}
        >
          {categoryName}
        </Typography>
      </Box>
      <Container
        sx={{
          position: 'relative',
          mt: { xs: -8, md: -12 },
          mb: 6,
          pt: { xs: 5, md: 8 },
          pb: { xs: 5, md: 8 },
          borderRadius: 5,
          background: 'background.paper',
          boxShadow: 10,
          zIndex: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 4,
              minHeight: 120,
            }}
          >
            {locations.length === 0 ? (
              <Typography
                variant="h6"
                align="center"
                sx={{ width: '100%', mt: 8 }}
              >
                No locations found for this category.
              </Typography>
            ) : (
              locations.map((loc) => (
                <Box
                  key={loc.id || loc.name}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 'calc(50% - 16px)',
                      md: 'calc(33.333% - 24px)',
                    },
                    maxWidth: 400,
                    mx: 'auto',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    minHeight: 220,
                    background: 'none',
                    boxShadow: 'none',
                    p: 0,
                    m: 0,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: 10,
                    },
                  }}
                  onClick={() => loc.id && navigate(`/location/${loc.id}`)}
                  tabIndex={0}
                  aria-label={`View details for ${loc.name}`}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: { xs: 180, sm: 220, md: 240 },
                      backgroundImage: `url(${loc.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 3,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 900,
                        fontSize: '1.5rem',
                        color: 'transparent',
                        background:
                          'linear-gradient(to bottom, #fff 20%, rgba(255,255,255,0) 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 1,
                        p: 0,
                        m: 0,
                      }}
                      aria-label={loc.name}
                    >
                      {loc.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        position: 'absolute',
                        right: 16,
                        bottom: 16,
                        color: 'white',
                        fontSize: 14,
                        opacity: 0.85,
                        background: 'rgba(0,0,0,0.35)',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 400,
                        letterSpacing: 0.2,
                        boxShadow: 'none',
                      }}
                    >
                      {loc.district}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}
      </Container>
    </>
  );
}
