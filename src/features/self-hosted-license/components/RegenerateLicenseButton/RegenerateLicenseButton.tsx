import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useRegenerateSelfHostedLicense } from "../../api/useRegenerateSelfHostedLicense";
import classes from "./RegenerateLicenseButton.module.scss";

const RegenerateLicenseButton: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { regenerateSelfHostedLicense, isRegeneratingSelfHostedLicense } =
    useRegenerateSelfHostedLicense();

  const handleRegenerate = async () => {
    try {
      await regenerateSelfHostedLicense();

      notify.success({
        title: "You have successfully regenerated your APT credentials",
        message:
          "The curl command and license URL above now use the new token. The previous token no longer works.",
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <Button
      type="button"
      hasIcon
      disabled={isRegeneratingSelfHostedLicense}
      onClick={handleRegenerate}
      className={classes.regenerateButton}
    >
      <i className="p-icon--change-version" />
      <span>Regenerate token</span>
    </Button>
  );
};

export default RegenerateLicenseButton;
