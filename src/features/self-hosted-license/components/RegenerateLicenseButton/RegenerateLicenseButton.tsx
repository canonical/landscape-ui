import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useRegenerateSelfHostedLicense } from "../../api/useRegenerateSelfHostedLicense";
import classes from "./RegenerateLicenseButton.module.scss";

interface RegenerateLicenseButtonProps {
  readonly disabled: boolean;
}

const RegenerateLicenseButton: FC<RegenerateLicenseButtonProps> = ({
  disabled,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { regenerateSelfHostedLicense, isRegeneratingSelfHostedLicense } =
    useRegenerateSelfHostedLicense();

  const handleRegenerate = async () => {
    try {
      await regenerateSelfHostedLicense();

      notify.success({
        title: "Private token and license download URL regenerated",
        message: "The previous download URL no longer works.",
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <Button
      type="button"
      hasIcon
      disabled={disabled || isRegeneratingSelfHostedLicense}
      onClick={handleRegenerate}
      className={classes.regenerateButton}
    >
      <i className="p-icon--change-version" />
      <span>Regenerate private token</span>
    </Button>
  );
};

export default RegenerateLicenseButton;
