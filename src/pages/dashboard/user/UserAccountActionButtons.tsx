import { Button, Spinner } from "@canonical/react-components";
import classNames from "classnames";
import { FC } from "react";
import useUserDetails from "../../../hooks/useUserDetails";
import useConfirm from "../../../hooks/useConfirm";
import useDebug from "../../../hooks/useDebug";
import { Credential } from "../../../types/UserDetails";
import { getButtonTitle } from "./_helpers";

interface AccountActionButtonsProps {
  accountName: string;
  isLargeScreen: boolean;
  preferredAccount: boolean;
  credentials?: Credential;
  className?: string;
}

const UserAccountActionButtons: FC<AccountActionButtonsProps> = ({
  accountName,
  isLargeScreen,
  preferredAccount,
  credentials,
  className,
}) => {
  const { confirmModal, closeConfirmModal } = useConfirm();
  const debug = useDebug();
  const { setPreferredAccount, generateApiCredentials } = useUserDetails();
  const {
    mutateAsync: mutateSetPreferredAccount,
    isLoading: isSettingPreferredAccount,
  } = setPreferredAccount;
  const {
    mutateAsync: mutateGenerateApiCredentials,
    isLoading: isLoadingCredentials,
  } = generateApiCredentials;

  const buttonTitle = getButtonTitle(credentials);

  const handleGenerateKeysMutation = async () => {
    try {
      await mutateGenerateApiCredentials({
        account: accountName,
      });
    } catch (error: unknown) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleSetPreferredAccountMutation = async () => {
    try {
      await mutateSetPreferredAccount({
        preferred_account: accountName,
      });
    } catch (error: unknown) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleGenerateKeys = () => {
    confirmModal({
      body: "Are you sure you want to perform this action?",
      title: "Generate new API credentials",
      buttons: [
        <Button
          key="confirm-generate-credentials"
          appearance="positive"
          hasIcon={true}
          onClick={handleGenerateKeysMutation}
          aria-label={`Confirm key generation for ${accountName}`}
        >
          {isLoadingCredentials && <Spinner />}
          Generate
        </Button>,
      ],
    });
  };

  const handleSetPreferredAccount = () => {
    confirmModal({
      body: "Are you sure you want to perform this action?",
      title: `Set ${accountName} as preferred account`,
      buttons: [
        <Button
          key="confirm-set-preferred-account"
          appearance="positive"
          hasIcon={true}
          onClick={handleSetPreferredAccountMutation}
          aria-label={`Confirm set ${accountName} as preferred account`}
        >
          {isSettingPreferredAccount && <Spinner />}
          Confirm
        </Button>,
      ],
    });
  };

  return (
    <div>
      {!preferredAccount && (
        <Button
          className={classNames(
            "u-no-margin--bottom",
            { "is-small": isLargeScreen },
            className,
          )}
          onClick={handleSetPreferredAccount}
        >
          Set default
        </Button>
      )}
      <Button
        className={classNames(
          "u-no-margin--bottom",
          { "is-small": isLargeScreen },
          className,
        )}
        onClick={handleGenerateKeys}
      >
        <span>{buttonTitle}</span>
      </Button>
    </div>
  );
};

export default UserAccountActionButtons;
