import type { FC } from "react";
import useDebug from "@/hooks/useDebug";
import type { LoginRequestParams } from "@/features/auth";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import AccountCreationAlternative from "../../../AccountCreationAlternative/AccountCreationAlternative";
import type { CreateStandaloneAccountParams } from "../../../../api";
import type { PamUserFormValues } from "../PamUserForm/types";
import PamUserForm from "../PamUserForm";

interface PamAccountCreationFormProps {
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

const PamAccountCreationForm: FC<PamAccountCreationFormProps> = ({
  createStandaloneAccount,
  signInAfterCreation,
  submitting,
  oidcEnabled,
  ubuntuOneEnabled,
}) => {
  const debug = useDebug();

  const handleSubmit = async (values: PamUserFormValues) => {
    try {
      await createStandaloneAccount({
        name: values.name,
        email: values.email,
        identity: values.identity,
        password: values.password,
      });

      await signInAfterCreation({
        identity: values.identity,
        password: values.password,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <AuthTemplate title="Create a new Landscape account with PAM">
      <PamUserForm
        onSubmit={handleSubmit}
        submitButtonText="Create account"
        submitting={submitting}
      />
      <AccountCreationAlternative
        oidcEnabled={oidcEnabled}
        ubuntuOneEnabled={ubuntuOneEnabled}
      />
    </AuthTemplate>
  );
};

export default PamAccountCreationForm;
