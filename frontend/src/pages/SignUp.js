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
import { signup } from '../services/api';

// Theme
import withRoot from '../theme/withRoot';

function SignUp({ onAuth }) {
  const [sent, setSent] = React.useState(false);
  const navigate = useNavigate();

  const validate = (values) => {
    return required(
      ['username', 'password', 'first_name', 'last_name', 'mobile'],
      values
    );
  };

  const handleSubmit = async (values) => {
    setSent(true);
    try {
      const data = await signup(
        values.username,
        values.password,
        values.first_name,
        values.last_name,
        values.mobile
      );
      onAuth(data);
      navigate('/');
    } catch (err) {
      setSent(false);
      return { [FORM_ERROR]: 'Error signing up. Please try again.' };
    }
  };

  return (
    <React.Fragment>
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign Up
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/signin/" underline="always">
              Already have an account?
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
                name="username"
                required
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="new-password"
                label="Password"
                type="password"
                margin="normal"
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="first_name"
                label="First Name"
                margin="normal"
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="last_name"
                label="Last Name"
                margin="normal"
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="mobile"
                label="Mobile"
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
                color="secondary"
                fullWidth
              >
                {submitting || sent ? 'In progress…' : 'Sign Up'}
              </FormButton>
            </Box>
          )}
        </Form>
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(SignUp);
