import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Stack, TextField, MenuItem } from '@mui/material';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { DISTRICTS, CATEGORIES, TRAVEL_TIERS } from '../constants/options';
import AuthContext from '../context/AuthContext';
import {
  getTravelPartnerRequests,
  createTravelPartnerRequest,
} from '../services/api';

const initialForm = {
  source: '',
  destination: '',
  member: '',
  budget: '',
  tier: '',
  start_date: '',
  end_date: '',
  category: '',
  details: '',
};

export default function FindTravelPartnerPage() {
  const { user, token } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Prepopulate form if coming from route finding
  useEffect(() => {
    if (location.state && location.state.prefill) {
      setForm((prev) => ({ ...prev, ...location.state.prefill }));
      // Clear prefill state after using it, so it doesn't persist on reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!token) {
      navigate('/signup');
      return;
    }
    getTravelPartnerRequests(token)
      .then((data) => setListings(data))
      .catch(() => setError('Failed to load listings'))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const cleanedForm = { ...form };
    // Convert empty string to null for optional date fields
    ['start_date', 'end_date'].forEach((key) => {
      if (!cleanedForm[key]) cleanedForm[key] = null;
    });
    createTravelPartnerRequest(cleanedForm, token)
      .then((res) => {
        setListings([res, ...listings]);
        setForm(initialForm);
      })
      .catch(() => setError('Submission failed'));
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shine-move {
        0% { left: -75%; }
        100% { left: 110%; }
      }
      .flip-card-front {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg,rgb(55, 118, 167) 0%,rgb(193, 253, 255) 100%);
      }
      .flip-card-front::before {
        content: "";
        position: absolute;
        top: 0;
        left: -75%;
        width: 2%;
        height: 100%;
        border-radius: 8px;
        background: linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.08) 100%);
        opacity: 0.3;
        pointer-events: none;
        animation: shine-move 3s linear infinite;
        z-index: 1;
        filter: blur(0.5px);
        transform: skewX(-20deg);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <Box
          sx={{
            p: 3,
            mb: 6,
            border: '1px solid #eee',
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 6,
            textAlign: 'center',
          }}
          aria-label="Find Travel Partner Form"
        >
          <Typography variant="h4" align="center" gutterBottom>
            Find Travel Partner
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <TextField
              select
              label="Source"
              name="source"
              value={form.source}
              onChange={handleChange}
              required
              sx={{ flex: 1, minWidth: 120 }}
            >
              {DISTRICTS.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Destination"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              required
              sx={{ flex: 1, minWidth: 120 }}
            >
              {DISTRICTS.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Member"
              name="member"
              value={form.member}
              onChange={handleChange}
              type="number"
              required
              sx={{ flex: 1, minWidth: 80 }}
            />
            <TextField
              label="Budget"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              type="number"
              sx={{ flex: 1, minWidth: 80 }}
            />
            <TextField
              select
              label="Travel Tier"
              name="tier"
              value={form.tier}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 120 }}
            >
              <MenuItem value="">Select Tier</MenuItem>
              {TRAVEL_TIERS.map((tier) => (
                <MenuItem key={tier.value} value={tier.value}>
                  {tier.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start Date"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 120 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="End Date"
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 120 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 120 }}
            >
              <MenuItem value="">None</MenuItem>
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Details"
              name="details"
              value={form.details}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </form>
      <Typography variant="h6" gutterBottom>
        Recent Requests
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : listings.length === 0 ? (
        <Typography>No requests yet.</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)',
            },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {listings.map((item) => (
            <Box
              key={item.id}
              sx={{
                perspective: 1000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                tabIndex={0}
                sx={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                  position: 'relative',
                  cursor: 'pointer',
                  border: '1px solid rgb(45, 112, 151)',
                  borderRadius: 2,
                  bgcolor: '#fafafa',
                  boxShadow: 10,
                  transition: 'box-shadow 0.2s',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  perspective: 1000,
                  overflow: 'visible',
                }}
                onClick={() => navigate(`/travel-partner/${item.id}`)}
                className="flip-card"
              >
                <Box
                  className="flip-card-inner"
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.5s cubic-bezier(.4,2,.6,1)',
                    transformStyle: 'preserve-3d',
                    borderRadius: 2,
                    '&:hover, &:focus': {
                      transform: 'rotateY(180deg)',
                    },
                  }}
                >
                  {/* Front */}
                  <Box
                    className="flip-card-front"
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'transparent',
                      background: `linear-gradient(135deg, rgba(0,183,255,0.10) 0%, rgba(0,255,183,0.13) 100%)`,
                      boxShadow:
                        '0 4px 24px 0 rgba(0,183,255,0.10), 0 1.5px 8px 0 rgba(0,255,183,0.10)',
                      overflow: 'hidden',
                      zIndex: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {item.source} → {item.destination}
                    </Typography>
                    <Typography variant="body2">
                      Budget: {item.budget || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Member: {item.member || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Start: {item.start_date || '-'}
                    </Typography>
                    <Typography variant="body2">
                      End: {item.end_date || '-'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      By {item.user}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(item.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  {/* Back (Details) */}
                  <Box
                    className="flip-card-back"
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      backfaceVisibility: 'hidden',
                      background:
                        'linear-gradient(135deg, rgba(121, 190, 211, 0.25) 0%, rgba(0,183,255,0.48) 100%)',
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      transform: 'rotateY(180deg)',
                      fontSize: 15,
                      fontWeight: 400,
                      overflow: 'hidden',
                      boxShadow: '0 4px 32px 0 rgba(0,183,255,0.10)',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: 2,
                        background:
                          'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(0,183,255,0.12) 100%)',
                        opacity: 0.7,
                        pointerEvents: 'none',
                      },
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: 2,
                        background:
                          'radial-gradient(circle at 60% 20%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 80%)',
                        opacity: 0.5,
                        pointerEvents: 'none',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        maxHeight: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        zIndex: 1,
                      }}
                    >
                      {item.details && item.details.length > 180
                        ? item.details.slice(0, 180) + '...'
                        : item.details}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
}
