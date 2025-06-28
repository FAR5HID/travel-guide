import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Typography from '../components/Typography';
import { TRAVEL_TIERS } from '../constants/options';
import AuthContext from '../context/AuthContext';
import {
  getTravelPartnerRequestDetail,
  addTravelPartnerComment,
} from '../services/api';

export default function TravelPartnerDetailPage() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userPhotos, setUserPhotos] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [savingComment, setSavingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [editingRequest, setEditingRequest] = useState(false);
  const [editingRequestData, setEditingRequestData] = useState(null);
  const [savingRequest, setSavingRequest] = useState(false);
  const [deletingRequest, setDeletingRequest] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/signup');
      return;
    }
    getTravelPartnerRequestDetail(id, token)
      .then((res) => {
        setRequest(res);
        setComments(res.comments || []);
        // Collect usernames (request.user + all comment users)
        const usernames = [
          res.user,
          ...(res.comments || []).map((c) => c.user),
        ];
        // Fetch all profile photos in parallel
        Promise.all(
          usernames.map((u) =>
            fetch(`${process.env.REACT_APP_API_BASE_URL || ''}profile/${u}/`, {
              headers: { Authorization: `Token ${token}` },
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((data) => ({ username: u, photo: data?.photo }))
              .catch(() => ({ username: u, photo: null }))
          )
        ).then((results) => {
          const photos = {};
          results.forEach(({ username, photo }) => {
            if (username) photos[username] = photo;
          });
          setUserPhotos(photos);
        });
      })
      .catch(() => setError('Failed to load request'))
      .finally(() => setLoading(false));
  }, [id, token, navigate]);

  const handleComment = (e) => {
    e.preventDefault();
    setError('');
    addTravelPartnerComment(id, commentText, token)
      .then((res) => {
        setComments([...comments, res]);
        setCommentText('');
      })
      .catch(() => setError('Failed to add comment'));
  };

  function renderUserAvatar({ username, photo, size = 32, sx = {} }) {
    // If photo is an absolute URL, use as is. If relative, prefix with API base or public URL.
    let src = photo;
    if (!src) {
      src = process.env.PUBLIC_URL + '/images/placeholder.png';
    } else if (
      src &&
      !/^https?:\/\//.test(src) &&
      !src.startsWith(process.env.PUBLIC_URL)
    ) {
      // Assume backend returns relative path, prefix with API base
      src = (process.env.REACT_APP_API_BASE_URL || '') + src;
    }
    return (
      <Avatar
        src={src}
        alt={username}
        sx={{ width: size, height: size, ...sx }}
      >
        {!photo && username ? username[0].toUpperCase() : null}
      </Avatar>
    );
  }

  // Edit comment handlers
  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };
  const saveEditComment = async (commentId) => {
    setSavingComment(true);
    try {
      const updated = await import('../services/api').then((api) =>
        api.updateTravelPartnerComment(
          commentId,
          { text: editingCommentText },
          token
        )
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, text: updated.text, updated_at: updated.updated_at }
            : c
        )
      );
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch {
      setError('Failed to update comment');
    } finally {
      setSavingComment(false);
    }
  };
  // Delete comment handler
  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    setDeletingCommentId(commentId);
    try {
      await import('../services/api').then((api) =>
        api.deleteTravelPartnerComment(commentId, token)
      );
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError('Failed to delete comment');
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Edit request handlers
  const startEditRequest = () => {
    setEditingRequestData({
      source: request.source,
      destination: request.destination,
      member: request.member,
      budget: request.budget,
      tier: request.tier,
      start_date: request.start_date,
      end_date: request.end_date,
      category: request.category,
      details: request.details,
    });
    setEditingRequest(true);
  };
  const cancelEditRequest = () => {
    setEditingRequest(false);
    setEditingRequestData(null);
  };
  const handleRequestChange = (e) => {
    setEditingRequestData({
      ...editingRequestData,
      [e.target.name]: e.target.value,
    });
  };
  const saveEditRequest = async () => {
    setSavingRequest(true);
    try {
      const updated = await import('../services/api').then((api) =>
        api.updateTravelPartnerRequest(id, editingRequestData, token)
      );
      setRequest((prev) => ({ ...prev, ...updated }));
      setEditingRequest(false);
      setEditingRequestData(null);
    } catch {
      setError('Failed to update request');
    } finally {
      setSavingRequest(false);
    }
  };
  const deleteRequest = async () => {
    if (!window.confirm('Delete this travel partner request?')) return;
    setDeletingRequest(true);
    try {
      await import('../services/api').then((api) =>
        api.deleteTravelPartnerRequest(id, token)
      );
      navigate('/travel-partner');
    } catch {
      setError('Failed to delete request');
    } finally {
      setDeletingRequest(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!request)
    return <Typography color="error">{error || 'Not found'}</Typography>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Travel Partner Request
      </Typography>
      <div
        style={{
          border: 'none',
          borderRadius: 18,
          padding: 32,
          marginBottom: 32,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #b2ebf2 100%)',
          boxShadow:
            '0 10px 40px 0 rgba(24, 144, 255, 0.22), 0 2px 16px 0 rgba(8, 60, 109, 0.51)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {user &&
          (user.username === request.user || user === request.user) &&
          !editingRequest && (
            <div style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
              <Button
                size="small"
                variant="text"
                color="primary"
                sx={{ mr: 1 }}
                onClick={startEditRequest}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="text"
                color="error"
                onClick={deleteRequest}
                disabled={deletingRequest}
              >
                {deletingRequest ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        {editingRequest ? (
          <form
            style={{ width: '100%', maxWidth: 1200 }}
            onSubmit={(e) => {
              e.preventDefault();
              saveEditRequest();
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 16,
              }}
            >
              <TextField
                select
                label="Source"
                name="source"
                value={editingRequestData.source}
                onChange={handleRequestChange}
                required
                sx={{ flex: 1, minWidth: 120 }}
              >
                {require('../constants/options').DISTRICTS.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Destination"
                name="destination"
                value={editingRequestData.destination}
                onChange={handleRequestChange}
                required
                sx={{ flex: 1, minWidth: 120 }}
              >
                {require('../constants/options').DISTRICTS.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Member"
                name="member"
                value={editingRequestData.member}
                onChange={handleRequestChange}
                type="number"
                required
                sx={{ flex: 1, minWidth: 80 }}
              />
              <TextField
                label="Budget"
                name="budget"
                value={editingRequestData.budget}
                onChange={handleRequestChange}
                type="number"
                sx={{ flex: 1, minWidth: 80 }}
              />
              <TextField
                select
                label="Travel Tier"
                name="tier"
                value={editingRequestData.tier}
                onChange={handleRequestChange}
                sx={{ flex: 1, minWidth: 120 }}
              >
                <MenuItem value="">Select Tier</MenuItem>
                {require('../constants/options').TRAVEL_TIERS.map((tier) => (
                  <MenuItem key={tier.value} value={tier.value}>
                    {tier.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Start Date"
                name="start_date"
                type="date"
                value={editingRequestData.start_date}
                onChange={handleRequestChange}
                sx={{ flex: 1, minWidth: 120 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                name="end_date"
                type="date"
                value={editingRequestData.end_date}
                onChange={handleRequestChange}
                sx={{ flex: 1, minWidth: 120 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Category"
                name="category"
                value={editingRequestData.category}
                onChange={handleRequestChange}
                sx={{ flex: 1, minWidth: 120 }}
              >
                <MenuItem value="">None</MenuItem>
                {require('../constants/options').CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <TextField
              label="Details"
              name="details"
              value={editingRequestData.details}
              onChange={handleRequestChange}
              multiline
              rows={5}
              fullWidth
              margin="normal"
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={savingRequest}
                sx={{ px: 4 }}
              >
                {savingRequest ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={cancelEditRequest}
                disabled={savingRequest}
                sx={{ px: 4 }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: '#0e3c5e', mb: 1 }}
            >
              {request.source} → {request.destination}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#1976d2', fontWeight: 500, mb: 1 }}
            >
              Budget:{' '}
              <b style={{ color: '#185475' }}>{request.budget || 'N/A'}</b> |
              Member: <b style={{ color: '#185475' }}>{request.member}</b>
            </Typography>
            <Typography variant="body2" sx={{ color: '#1565c0', mb: 1 }}>
              Tier:{' '}
              <b style={{ color: '#185475' }}>
                {TRAVEL_TIERS.find(
                  (t) => String(t.value) === String(request.tier)
                )?.label || 'N/A'}
              </b>
            </Typography>
            <Typography variant="body2" sx={{ color: '#1565c0', mb: 1 }}>
              Start:{' '}
              <b style={{ color: '#185475' }}>{request.start_date || '-'}</b> |
              End: <b style={{ color: '#185475' }}>{request.end_date || '-'}</b>
            </Typography>
            <Typography variant="body2" sx={{ color: '#1565c0', mb: 1 }}>
              Category:{' '}
              <b style={{ color: '#185475' }}>{request.category || 'N/A'}</b>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              By{' '}
              <b>
                <span
                  style={{
                    cursor: 'pointer',
                    color: '#1976d2',
                    display: 'inline-flex',
                    alignItems: 'center',
                    verticalAlign: 'middle',
                  }}
                  onClick={() => navigate(`/profile/${request.user}`)}
                >
                  {renderUserAvatar({
                    username: request.user,
                    photo: userPhotos[request.user],
                    size: 32,
                    sx: { mr: 1, boxShadow: 6, lineHeight: 1 },
                  })}
                  {request.user}
                </span>
              </b>{' '}
              | {new Date(request.created_at).toLocaleString()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                color: '#263238',
                background: 'rgba(243, 248, 247, 0.63)',
                borderRadius: 2,
                p: 2,
                boxShadow: '0 1px 6px 0 rgba(24, 143, 255, 0.81)',
              }}
            >
              {request.details}
            </Typography>
          </>
        )}
      </div>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: '#1769aa', fontWeight: 600 }}
      >
        Comments
      </Typography>
      <div
        style={{
          borderRadius: 12,
          background: '#f5fafd',
          boxShadow:
            '0 6px 24px 0 rgba(24, 144, 255, 0.18), 0 2px 12px 0 rgba(24, 144, 255, 0.10)',
          padding: 20,
          marginBottom: 32,
        }}
      >
        {comments.length === 0 ? (
          <Typography color="textSecondary">No comments yet.</Typography>
        ) : (
          comments.map((c) => {
            const isEditing = editingCommentId === c.id;
            const isOwner =
              user && (user.username === c.user || user === c.user);
            return (
              <div
                key={c.id}
                style={{
                  borderBottom: '1px solid #e3eaf2',
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      cursor: 'pointer',
                      color: '#1976d2',
                      display: 'inline-flex',
                      alignItems: 'center',
                      verticalAlign: 'middle',
                      fontWeight: 500,
                    }}
                    onClick={() => navigate(`/profile/${c.user}`)}
                  >
                    {renderUserAvatar({
                      username: c.user,
                      photo: userPhotos[c.user],
                      size: 28,
                      sx: { mr: 1, boxShadow: 6, lineHeight: 1 },
                    })}
                    {c.user}
                  </span>
                  <span style={{ color: '#888', fontSize: 13 }}>
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                  {isOwner && !isEditing && (
                    <>
                      <Button
                        size="small"
                        variant="text"
                        color="primary"
                        sx={{ ml: 1, minWidth: 0, fontSize: 13, p: 0.5 }}
                        onClick={() => startEditComment(c)}
                        disabled={editingCommentId === c.id}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        sx={{ ml: 0.5, minWidth: 0, fontSize: 13, p: 0.5 }}
                        onClick={() => deleteComment(c.id)}
                        disabled={deletingCommentId === c.id}
                      >
                        {deletingCommentId === c.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </>
                  )}
                </div>
                {isEditing ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <TextField
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      size="small"
                      multiline
                      minRows={1}
                      maxRows={4}
                      sx={{ flex: 1, background: '#fff', borderRadius: 2 }}
                      disabled={savingComment}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      sx={{ fontSize: 13, px: 2, py: 0.5, borderRadius: 2 }}
                      onClick={() => saveEditComment(c.id)}
                      disabled={savingComment || !editingCommentText.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ fontSize: 13, px: 2, py: 0.5, borderRadius: 2 }}
                      onClick={cancelEditComment}
                      disabled={savingComment}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Typography variant="body2" sx={{ color: '#263238' }}>
                    {c.text}
                  </Typography>
                )}
              </div>
            );
          })
        )}
      </div>
      <form
        onSubmit={handleComment}
        style={{ marginTop: 16, textAlign: 'center' }}
      >
        <TextField
          label="Add a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          fullWidth
          multiline
          rows={2}
          required
          sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: 1,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            fontSize: 16,
          }}
        >
          Comment
        </Button>
      </form>
    </div>
  );
}
