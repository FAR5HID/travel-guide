import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '../components/Button';
import Paper from '../components/Paper';
import TextField from '../components/TextField';
import Typography from '../components/Typography';
import AuthContext from '../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../services/api';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

function EditProfilePage() {
  const auth = useContext(AuthContext);
  const token = auth?.token;
  const [profile, setProfile] = React.useState(null);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [aboutMe, setAboutMe] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [photo, setPhoto] = React.useState(null);
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    getMyProfile(token)
      .then((data) => {
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setMobile(data.mobile || '');
        setAboutMe(data.about_me || '');
        setDistrict(data.district || '');
        setPhotoPreview(null); // Reset preview on load
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!firstName || !lastName || !mobile) {
      setError('First name, last name, and mobile are required.');
      setSaving(false);
      return;
    }
    try {
      const updated = await updateMyProfile(auth.token, {
        first_name: firstName,
        last_name: lastName,
        mobile,
        district,
        about_me: aboutMe,
        photo,
      });
      setPhotoPreview(null); // Reset preview after save
      navigate(`/profile/${updated.username || profile.username || ''}`); // Use username from response or fallback
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

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
    <Paper sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Edit Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={
              photoPreview ||
              profile.photo ||
              process.env.PUBLIC_URL + '/images/placeholder.png'
            }
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <Button variant="contained" component="label">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </Button>
        </Box>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          About Me
        </Typography>
        <ReactQuill
          theme="snow"
          value={aboutMe}
          onChange={setAboutMe}
          style={{ height: 180, marginBottom: 24 }}
          modules={quillModules}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          disabled={saving}
          sx={{ mt: 2 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Paper>
  );
}

export default EditProfilePage;
