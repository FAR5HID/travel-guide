import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AuthContext from '../context/AuthContext';

function ProfileMenu({ onLogout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    if (user?.username) {
      navigate(`/profile/${user.username}`);
      handleClose();
    }
  };
  const handleEdit = () => {
    navigate('/profile/edit');
    handleClose();
  };

  if (!user) return null;
  return (
    <>
      <IconButton onClick={handleMenu} sx={{ p: 0, ml: 2 }}>
        <Avatar
          src={user.photo || process.env.PUBLIC_URL + '/images/placeholder.png'}
          alt="Profile"
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>View Profile</MenuItem>
        <MenuItem onClick={handleEdit}>Edit Profile</MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu;
