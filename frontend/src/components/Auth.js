import React, { useState } from 'react';
import { signup, login, logout } from '../services/api';
import { Button, TextField, Box, Typography, Stack } from '@mui/material';

export function Signup({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Box component="form" onSubmit={async e => {
      e.preventDefault();
      const data = await signup(username, password);
      onAuth(data);
    }} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>
      <Stack spacing={2}>
        <TextField
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">Sign Up</Button>
      </Stack>
    </Box>
  );
}

export function Login({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Box component="form" onSubmit={async e => {
      e.preventDefault();
      const data = await login(username, password);
      onAuth(data);
    }} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <Stack spacing={2}>
        <TextField
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </Stack>
    </Box>
  );
}

export function Logout({ token, onLogout }) {
  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={async () => {
        await logout(token);
        onLogout();
      }}
      sx={{ mt: 2 }}
    >
      Logout
    </Button>
  );
}
