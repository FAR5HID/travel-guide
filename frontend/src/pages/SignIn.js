import React from 'react';

// Third-party libraries
import { Field, Form, FormSpy } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { useNavigate } from 'react-router-dom';

// MUI components
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// Project components
import Typography from '../components/Typography';
import AppForm from '../views/AppForm';
import RFTextField from '../form/RFTextField';
import FormButton from '../form/FormButton';
import FormFeedback from '../form/FormFeedback';

// Utilities and services
import { required } from '../form/validation';
import { login } from '../services/api';

// Theme
import withRoot from '../theme/withRoot';

function SignIn({ onAuth }) {
  const [sent, setSent] = React.useState(false);
  const navigate = useNavigate();

  const validate = (values) => {
    return required(['username', 'password'], values);
  };

  const handleSubmit = async (values) => {
    setSent(true);
    try {
      const data = await login(values.username, values.password);
      onAuth(data);
      navigate('/');
    } catch (err) {
      setSent(false);
      return { [FORM_ERROR]: 'Invalid username or password' };
    }
  };

  return (
    <React.Fragment>
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign In
          </Typography>
          <Typography variant="body2" align="center">
            {'Not a member yet? '}
            <Link href="/signup/" align="center" underline="always">
              Sign Up here
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box
              component="form"
              onSubmit={handleSubmit2}
              noValidate
              sx={{ mt: 6 }}
            >
              <Field
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Username"
                margin="normal"
                name="username"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
                margin="normal"
              />
              <FormSpy subscription={{ submitError: true }}>
                {({ submitError }) =>
                  submitError ? (
                    <FormFeedback error sx={{ mt: 2 }}>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                sx={{ mt: 3, mb: 2 }}
                disabled={submitting || sent}
                size="large"
                color="secondary"
                fullWidth
              >
                {submitting || sent ? 'In progress…' : 'Sign In'}
              </FormButton>
            </Box>
          )}
        </Form>
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(SignIn);
