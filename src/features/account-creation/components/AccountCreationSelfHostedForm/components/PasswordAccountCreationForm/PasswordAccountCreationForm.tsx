import classNames from 'classnames';
import type { FC } from 'react';
import AuthTemplate from '@/templates/auth/AuthTemplate';
import useDebug from '@/hooks/useDebug';
import AccountCreationAlternative from '../../../AccountCreationAlternative/AccountCreationAlternative';
import type { CreateStandaloneAccountParams } from '../../../../api';
import type { LoginRequestParams } from '@/features/auth';
import PasswordUserForm, {
  type PasswordUserFormValues,
} from '../PasswordUserForm';
import classes from './PasswordAccountCreationForm.module.scss';

interface PasswordAccountCreationFormProps {
  readonly createStandaloneAccount: (
    params: CreateStandaloneAccountParams,
  ) => Promise<unknown>;
  readonly signInAfterCreation: (
    credentials: LoginRequestParams,
  ) => Promise<void>;
  readonly submitting: boolean;
  readonly oidcEnabled: boolean;
  readonly ubuntuOneEnabled: boolean;
}

const PasswordAccountCreationForm: FC<PasswordAccountCreationFormProps> = ({
  createStandaloneAccount,
  signInAfterCreation,
  submitting,
  oidcEnabled,
  ubuntuOneEnabled,
}) => {
  const debug = useDebug();

  const handleSubmit = async (values: PasswordUserFormValues) => {
    try {
      await createStandaloneAccount({
        name: values.name.trim(),
        email: values.email,
        password: values.password,
      });

      await signInAfterCreation({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <AuthTemplate title='Create a new Landscape account'>
      <PasswordUserForm
        onSubmit={handleSubmit}
        submitButtonText='Create account'
        submitButtonClassName={classNames(classes.button, 'u-margin--bottom')}
        submitting={submitting}
      />
      <AccountCreationAlternative
        oidcEnabled={oidcEnabled}
        ubuntuOneEnabled={ubuntuOneEnabled}
      />
    </AuthTemplate>
  );
};

export default PasswordAccountCreationForm;
