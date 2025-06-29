import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Typography from '../components/Typography';
import { CATEGORIES } from '../constants/options';

const ImageBackdrop = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  background: '#000',
  opacity: 0.5,
  transition: theme.transitions.create('opacity'),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  padding: 0,
  borderRadius: 0,
  height: '40vh',
  [theme.breakpoints.down('md')]: {
    width: '100% !important',
    height: 100,
  },
  '&:hover': {
    zIndex: 1,
  },
  '&:hover .imageBackdrop': {
    opacity: 0.15,
  },
  '&:hover .imageMarked': {
    opacity: 0,
  },
  '&:hover .imageTitle': {
    border: '4px solid currentColor',
  },
  '& .imageTitle': {
    position: 'relative',
    padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
  },
  '& .imageMarked': {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

const images = [
  {
    title: CATEGORIES[0],
    url: '/images/Dorianagar.jpg',
    width: '35%',
    alt: 'Dorianagar Beach',
  },
  {
    title: CATEGORIES[1],
    url: '/images/Bandarban.jpg',
    width: '30%',
    alt: 'Bandarban Hills',
  },
  {
    title: CATEGORIES[2],
    url: '/images/Amiakhum.png',
    width: '35%',
    alt: 'Amiakhum Waterfall',
  },
  {
    title: CATEGORIES[3],
    url: '/images/Saint_Martin.jpg',
    width: '37%',
    alt: 'Saint Martin Island',
  },
  {
    title: CATEGORIES[4],
    url: '/images/Kaptai_Lake.jpg',
    width: '32%',
    alt: 'Kaptai Lake',
  },
  {
    title: CATEGORIES[6],
    url: '/images/Kris_Taung_2.jpg',
    width: '31%',
    alt: 'Kris Taung',
  },
  {
    title: CATEGORIES[7],
    url: '/images/Dulahazara_Safari_Park.jpg',
    width: '33%',
    alt: 'Dulahazara Safari Park',
  },
  {
    title: CATEGORIES[8],
    url: '/images/Shalban_Bihar.jpg',
    width: '34%',
    alt: 'Shalban Bihar',
  },
  {
    title: CATEGORIES[9],
    url: '/images/Chandranath_1.jpg',
    width: '33%',
    alt: 'Chandranath Hill',
  },
];

export default function LocationCategories() {
  return (
    <Container component="section" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" marked="center" align="center" component="h2">
        Destinations for every passion and every dream
      </Typography>
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {images.map((image) => (
          <ImageIconButton
            key={image.title}
            style={{
              width: image.width,
            }}
            focusRipple
            role="button"
            aria-label={image.title}
            tabIndex={0}
            component={Link}
            to={`/category/${encodeURIComponent(image.title)}`}
          >
            <Box
              component="img"
              src={image.url}
              alt={image.alt}
              sx={{
                display: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                backgroundImage: `url(${image.url})`,
              }}
            />
            <ImageBackdrop className="imageBackdrop" />
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white',
              }}
            >
              <Typography
                component="h3"
                variant="h6"
                color="inherit"
                className="imageTitle"
              >
                {image.title}
                <div className="imageMarked" />
              </Typography>
            </Box>
          </ImageIconButton>
        ))}
      </Box>
    </Container>
  );
}
