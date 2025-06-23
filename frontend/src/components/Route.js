import React, { useState } from 'react';

// MUI components
import {
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';

// Project-specific imports
import { getRoute } from '../services/api';
import { DISTRICTS, CATEGORIES } from '../constants/options';

const columns = { xs: 1, sm: 2, md: 3, lg: 4 }; // Grid breakpoints

function getMarginLeft(idx, columns) {
  // Returns 0 if first in row, else negative margin for overlap
  return {
    xs: idx % columns.xs === 0 ? 0 : '-5%',
    sm: idx % columns.sm === 0 ? 0 : '-4%',
    md: idx % columns.md === 0 ? 0 : '-3%',
    lg: idx % columns.lg === 0 ? 0 : '-2.5%',
  };
}

function getMarginTop(idx, columns) {
  return {
    xs: idx < columns.xs ? 0 : '-24px',
    sm: idx < columns.sm ? 0 : '-24px',
    md: idx < columns.md ? 0 : '-24px',
    lg: idx < columns.lg ? 0 : '-24px',
  };
}

function isInLastRow(idx, total, cols) {
  // Number of full rows
  const fullRows = Math.floor(total / cols);
  // Index of first item in last row
  const firstInLastRow = fullRows * cols;
  return idx >= firstInLastRow;
}

export default function Route() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  let currentCols = 1;
  if (isLg) currentCols = columns.lg;
  else if (isMd) currentCols = columns.md;
  else if (isSm) currentCols = columns.sm;
  else if (isXs) currentCols = columns.xs;

  const [form, setForm] = useState({
    source: '',
    destination: '',
    budget: '',
    days: '',
    category: '',
  });
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await getRoute(form);
      setRoute(data.route);
    } catch (err) {
      setError('Failed to fetch route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ my: 6 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          border: '1px solid #eee',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
        aria-label="Travel Route Search Form"
      >
        <Typography variant="h4" align="center" gutterBottom>
          Find Travel Route
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
        >
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="source-label">Source</InputLabel>
            <Select
              labelId="source-label"
              id="source"
              name="source"
              value={form.source}
              label="Source"
              onChange={handleChange}
              required
            >
              {DISTRICTS.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="destination-label">Destination</InputLabel>
            <Select
              labelId="destination-label"
              id="destination"
              name="destination"
              value={form.destination}
              label="Destination"
              onChange={handleChange}
              required
            >
              {DISTRICTS.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Budget"
            name="budget"
            type="number"
            value={form.budget}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />

          <TextField
            label="Days"
            name="days"
            type="number"
            value={form.days}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />

          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={form.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ flex: 1, minWidth: 120 }}
          >
            Suggest Route
          </Button>
        </Stack>
        <Box
          sx={{
            minHeight: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 1,
          }}
        >
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
        {route && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Suggested Route:</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {route.map((location, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={location.id}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    ml: getMarginLeft(idx, columns),
                    mt: getMarginTop(idx, columns),
                    transition: 'z-index 0.2s',
                    '&:hover': {
                      zIndex: 10,
                    },
                    '&:has(div:hover)': {
                      zIndex: 10,
                    },
                  }}
                  aria-label={`Suggested location: ${location.name}`}
                >
                  <Box
                    sx={{
                      border: 'none',
                      borderRadius: 3,
                      p: 0,
                      bgcolor: 'background.default',
                      boxShadow: 3,
                      overflow: 'hidden',
                      transition:
                        'transform 0.2s, box-shadow 0.3s, border-radius 0.6s',
                      position: 'relative',
                      zIndex: 1,
                      '&:hover': {
                        transform: 'scale(1.07)',
                        boxShadow: 6,
                        borderRadius: 0,
                      },
                    }}
                  >
                    <Box
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      sx={{ position: 'relative', width: '100%', height: 180 }}
                      role="region"
                      aria-label={location.name}
                    >
                      <Box
                        component="img"
                        src={
                          location.image
                            ? location.image
                            : '/images/placeholder.png'
                        }
                        alt={location.name}
                        sx={{
                          width: '100%',
                          height: 180,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                      {/* Right shadow overlay, except for last in row and not hovered */}
                      {(idx + 1) % currentCols !== 0 &&
                        idx !== route.length - 1 &&
                        hoveredIdx !== idx && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              width: '18%',
                              height: '100%',
                              pointerEvents: 'none',
                              background:
                                'linear-gradient(to left, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0) 80%)',
                              zIndex: 2,
                            }}
                          />
                        )}

                      {/* Bottom shadow overlay, except for last row and not hovered */}
                      {!isInLastRow(idx, route.length, currentCols) &&
                        hoveredIdx !== idx && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              bottom: 0,
                              width: '100%',
                              height: '18%',
                              pointerEvents: 'none',
                              background:
                                'linear-gradient(to top, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0) 90%)',
                              zIndex: 2,
                            }}
                          />
                        )}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          pt: 1,
                          pointerEvents: 'none',
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            fontWeight: 900,
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            color: 'transparent',
                            background:
                              'linear-gradient(to bottom, #fff 20%, rgba(255,255,255,0) 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                          }}
                          aria-label={location.name}
                        >
                          {location.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
}
