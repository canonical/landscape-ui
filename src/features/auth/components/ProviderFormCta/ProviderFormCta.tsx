import { FC, lazy, Suspense } from "react";
import { Button, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./ProviderFormCta.module.scss";

const SupportedProviderList = lazy(() => import("../SupportedProviderList"));

interface ProviderFormCtaProps {
  action: "add" | "edit";
}

const ProviderFormCta: FC<ProviderFormCtaProps> = ({ action }) => {
  const { closeSidePanel, setSidePanelContent } = useSidePanel();

  const handleBack = () => {
    setSidePanelContent(
      "Choose an identity provider",
      <Suspense fallback={<LoadingState />}>
        <SupportedProviderList />
      </Suspense>,
    );
  };

  return (
    <div className={classes.container}>
      {action === "add" && (
        <Button
          type="button"
          hasIcon
          onClick={handleBack}
          className={classes.backButton}
        >
          <Icon name="chevron-up" className={classes.chevronIcon} />
          <span>Back</span>
        </Button>
      )}

      <Button
        type="button"
        onClick={closeSidePanel}
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
