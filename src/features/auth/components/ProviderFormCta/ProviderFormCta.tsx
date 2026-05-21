import type { FC } from "react";
import { Button, Icon } from "@canonical/react-components";
import usePageParams from "@/hooks/usePageParams";
import classes from "./ProviderFormCta.module.scss";

interface ProviderFormCtaProps {
  readonly action: "add" | "edit";
}

const ProviderFormCta: FC<ProviderFormCtaProps> = ({ action }) => {
  const { popSidePathUntilClear } = usePageParams();

  return (
    <div className={classes.container}>
      {action === "add" && (
        <Button
          type="button"
          hasIcon
          onClick={popSidePathUntilClear}
          className={classes.backButton}
        >
          <Icon name="chevron-up" className={classes.chevronIcon} />
          <span>Back</span>
        </Button>
      )}

      <Button
        type="button"
        onClick={popSidePathUntilClear}
        appearance="base"
        className="u-no-margin--bottom"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        appearance="positive"
        className="u-no-margin--bottom"
      >
        {action === "edit" ? "Save changes" : "Add ID provider"}
      </Button>
    </div>
  );
};

export default ProviderFormCta;
