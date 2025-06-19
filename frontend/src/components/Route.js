import React, { useState } from 'react';
import { getRoute } from '../services/api';
import { 
  Button, TextField, Box, Typography, Stack,
  MenuItem, Select, InputLabel, FormControl 
} from '@mui/material';
import { DISTRICTS, CATEGORIES } from '../constants/options';

export default function Route({ token }) {
  const [form, setForm] = useState({
    source: '',
    destination: '',
    budget: '',
    days: '',
    category: '',
  });
  const [route, setRoute] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await getRoute(form, token);
    setRoute(data.route);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Find Travel Route</Typography>
      <Stack spacing={2}>
        <FormControl fullWidth>
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
            {DISTRICTS.map(district => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
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
            {DISTRICTS.map(district => (
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
        />
        
        <TextField 
          label="Days" 
          name="days" 
          type="number"
          value={form.days} 
          onChange={handleChange} 
        />
        
        <FormControl fullWidth>
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
            {CATEGORIES.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button type="submit" variant="contained" color="primary">Suggest Route</Button>
      </Stack>
      {route && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Suggested Route:</Typography>
          <ul>
            {route.map(spot => (
              <li key={spot.id}>{spot.name}</li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}
