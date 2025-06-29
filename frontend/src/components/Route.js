import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  CircularProgress,
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

// Project-specific imports
import { DISTRICTS, CATEGORIES, TRAVEL_TIERS } from '../constants/options';
import { validateDateRange } from '../form/validation';
import { getRoute, getWeatherForecast } from '../services/api';

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
  const navigate = useNavigate();

  let currentCols = 1;
  if (isLg) currentCols = columns.lg;
  else if (isMd) currentCols = columns.md;
  else if (isSm) currentCols = columns.sm;
  else if (isXs) currentCols = columns.xs;

  const [form, setForm] = useState({
    source: '',
    destination: '',
    budget: '',
    tier: '',
    start_date: '',
    end_date: '',
    category: '',
  });
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [crowdAlert, setCrowdAlert] = useState(null); // new: holidays in range
  const [crowdAlertLoading, setCrowdAlertLoading] = useState(false);
  const [crowdAlertError, setCrowdAlertError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const dateError = validateDateRange(form.start_date, form.end_date);
    if (dateError) {
      setError(dateError);
      return;
    }
    setLoading(true);
    setWeather(null);
    setWeatherError(null);
    setCrowdAlert(null);
    setCrowdAlertError(null);
    try {
      const data = await getRoute(form);
      setRoute(data.route);
      // Fetch weather only after successful route fetch
      setWeatherLoading(true);
      try {
        const weatherData = await getWeatherForecast(
          form.destination,
          form.start_date,
          form.end_date
        );
        setWeather(weatherData);
      } catch (err) {
        setWeatherError('Failed to fetch weather forecast');
      } finally {
        setWeatherLoading(false);
      }
      // Fetch holidays (crowd alert)
      setCrowdAlertLoading(true);
      try {
        const { getBangladeshHolidaysInRange } = await import(
          '../services/api'
        );
        const holidays = await getBangladeshHolidaysInRange(
          form.start_date,
          form.end_date
        );
        setCrowdAlert(holidays);
      } catch (err) {
        setCrowdAlertError('Failed to check holidays for crowd alert');
      } finally {
        setCrowdAlertLoading(false);
      }
    } catch (err) {
      if (err && err.error) {
        setError(err.error);
      } else if (err && err.detail) {
        setError(err.detail);
      } else {
        setError('Failed to fetch route');
      }
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
          pb: 4,
          border: '1px solid #eee',
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 6,
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

          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="tier-label">Travel Tier</InputLabel>
            <Select
              labelId="tier-label"
              id="tier"
              name="tier"
              value={form.tier}
              label="Travel Tier"
              onChange={handleChange}
            >
              {TRAVEL_TIERS.map((tier) => (
                <MenuItem key={tier.value} value={tier.value}>
                  {tier.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            sx={{ flex: 1 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="End Date"
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
            sx={{ flex: 1 }}
            slotProps={{ inputLabel: { shrink: true } }}
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
          {loading && <CircularProgress size={24} />}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
        {route && (
          <Box sx={{ mt: 3, pb: 4 }}>
            <Grid
              container
              spacing={2}
              sx={{ mt: 2, justifyContent: 'center' }}
            >
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
                      boxShadow: 15,
                      overflow: 'hidden',
                      transition:
                        'transform 0.2s, box-shadow 0.3s, border-radius 0.6s',
                      position: 'relative',
                      zIndex: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.07)',
                        boxShadow: 18,
                        borderRadius: 0,
                      },
                    }}
                    onClick={() =>
                      location.id && navigate(`/location/${location.id}`)
                    }
                    tabIndex={0}
                    aria-label={`View details for ${location.name}`}
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
            {/* Weather Forecast Section */}
            <Box sx={{ mt: 8, mb: 4 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Weather Forecast
              </Typography>
              {weatherLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              {weatherError && (
                <Typography color="error" align="center">
                  {weatherError}
                </Typography>
              )}
              {weather && weather.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    py: 2,
                    justifyContent: 'center',
                  }}
                >
                  {weather.map((day) => (
                    <Box
                      key={day.datetime}
                      sx={{
                        minWidth: 140,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 6,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="subtitle2">
                        {new Date(day.datetime).toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Typography>
                      <Box>
                        <img
                          src={`https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${day.icon}.png`}
                          alt={day.conditions}
                          width={48}
                          height={48}
                          style={{ objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder.png';
                          }}
                        />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {Math.round(day.tempmin)}°C | {Math.round(day.tempmax)}
                        °C
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <WaterDropIcon
                          color="primary"
                          sx={{ fontSize: 20, mr: 0.5 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {day.humidity}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {day.conditions}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            {/* Crowd Alert Section */}
            <Box sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Crowd Alert
              </Typography>
              {crowdAlertLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
              {crowdAlertError && (
                <Typography color="error" align="center">
                  {crowdAlertError}
                </Typography>
              )}
              {crowdAlert && crowdAlert.length > 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    color: 'darkorange',
                    fontWeight: 600,
                  }}
                >
                  <Typography variant="body1">
                    Your selected dates include the following public holidays:
                  </Typography>
                  <ul style={{ display: 'inline-block', textAlign: 'left' }}>
                    {crowdAlert.map((h) => (
                      <li key={h.date.iso}>
                        {h.name} ({h.date.iso})
                      </li>
                    ))}
                  </ul>
                  <Typography variant="body2" color="text.secondary">
                    Expect larger crowds and higher demand for travel and
                    accommodation.
                  </Typography>
                </Box>
              ) : (
                crowdAlert && (
                  <Typography
                    variant="body1"
                    align="center"
                    color="success.main"
                  >
                    No major public holidays.
                  </Typography>
                )
              )}
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  // Prepopulate travel partner form with all route form data
                  navigate('/travel-partner', {
                    state: {
                      prefill: {
                        ...form,
                      },
                    },
                  });
                }}
                sx={{ mt: 2 }}
              >
                Find Travel Partner for this Route
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}
