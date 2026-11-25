import LoadingState from '@/components/layout/LoadingState';
import PasswordConstraints, {
  passwordValidationSchema,
} from '@/components/form/PasswordConstraints';
import useConfirmPasswordReset from '../../api/useConfirmPasswordReset';
import useGetPasswordResetStatus from '../../api/useGetPasswordResetStatus';
import { ROUTES } from '@/libs/routes';
import AuthTemplate from '@/templates/auth';
import type { ApiError } from '@/types/api/ApiError';
import { getFormikError } from '@/utils/formikErrors';
import { basicEmailSchema, normalizeEmail } from '@/utils/validation/email';
import {
  ActionButton,
  Button,
  Form,
  Input,
  PasswordToggle,
} from '@canonical/react-components';
import { HttpStatusCode, type AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useState, type FC } from 'react';
import { Link } from 'react-router';
import * as Yup from 'yup';

const isInvalidToken = (error: AxiosError<ApiError> | null) =>
  error?.response?.status === HttpStatusCode.BadRequest &&
  error.response.data?.error === 'InvalidPasswordResetToken';

const PasswordResetConfirmation: FC = () => {
  const {
    secureToken,
    isValid,
    isCheckingPasswordReset,
    error: statusError,
    retryPasswordResetStatus,
  } = useGetPasswordResetStatus();
  const { confirmPasswordReset, isConfirmingPasswordReset, error } =
    useConfirmPasswordReset();
  const [submitted, setSubmitted] = useState(false);
  const formik = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      email: basicEmailSchema().required('This field is required'),
      password: passwordValidationSchema.password,
      confirmPassword: Yup.string()
        .required('This field is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: async ({ email, password }, { resetForm }) => {
      if (!secureToken) {
        return;
      }
      try {
        await confirmPasswordReset({
          token: secureToken,
          email_address: normalizeEmail(email),
          new_password: password,
        });
        resetForm();
        setSubmitted(true);
      } catch {
        // Status and submission errors are handled below.
      }
    },
  });

  if (submitted) {
    return (
      <AuthTemplate title='Password Reset Complete'>
        <p>You may now close this tab.</p>
      </AuthTemplate>
    );
  }

  if (secureToken && isCheckingPasswordReset) {
    return <LoadingState />;
  }

  const invalidStatusToken = isInvalidToken(statusError);
  const invalidConfirmationToken = isInvalidToken(error);

  if (statusError && !invalidStatusToken) {
    return (
      <AuthTemplate title='Unable to validate password reset link'>
        <p role='alert'>
          {statusError.response?.data?.message || statusError.message}
        </p>
        <Button
          onClick={() => {
            void retryPasswordResetStatus();
          }}
        >
          Try again
        </Button>
        <p>
          <Link to={ROUTES.auth.login()}>Back to Login</Link>
        </p>
      </AuthTemplate>
    );
  }

  if (
    !secureToken ||
    !isValid ||
    invalidStatusToken ||
    invalidConfirmationToken
  ) {
    return (
      <AuthTemplate title='Invalid password reset link'>
        <p>
          {(invalidStatusToken && statusError?.response?.data?.message) ||
            (invalidConfirmationToken && error?.response?.data?.message) ||
            'This password reset link is invalid or has expired. Request a new link.'}
        </p>
        <p>
          <Link to={ROUTES.auth.forgotPassword()}>Request a new link</Link>
        </p>
        <Link to={ROUTES.auth.login()}>Back to Login</Link>
      </AuthTemplate>
    );
  }

  return (
    <AuthTemplate title='Reset password'>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Input
          type='email'
          label='Email address'
          required
          autoComplete='email'
          error={getFormikError(formik, 'email')}
          {...formik.getFieldProps('email')}
        />
        <PasswordToggle
          id='new-password'
          label='New password'
          required
          autoComplete='new-password'
          error={getFormikError(formik, 'password')}
          {...formik.getFieldProps('password')}
        />
        <PasswordConstraints
          password={formik.values.password}
          touched={!!formik.touched.password}
          hasError={!!formik.errors.password}
        />
        <PasswordToggle
          id='confirm-password'
          label='Confirm new password'
          required
          autoComplete='new-password'
          error={getFormikError(formik, 'confirmPassword')}
          {...formik.getFieldProps('confirmPassword')}
        />
        {error && (
          <p role='alert' className='u-text--negative'>
            {error.response?.data?.message || error.message}
          </p>
        )}
        <ActionButton
          type='submit'
          appearance='positive'
          loading={isConfirmingPasswordReset}
          disabled={formik.isSubmitting || isConfirmingPasswordReset}
        >
          Reset password
        </ActionButton>
      </Form>
      <Link to={ROUTES.auth.login()}>Back to Login</Link>
    </AuthTemplate>
  );
};

export default PasswordResetConfirmation;
