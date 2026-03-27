import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { DistributionContainer } from "@/features/mirrors";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import { Button, ContextualMenu } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const NewDistributionForm = lazy(async () =>
  import("@/features/mirrors").then((module) => ({
    default: module.NewDistributionForm,
  })),
);
const NewSeriesForm = lazy(async () =>
  import("@/features/mirrors").then((module) => ({
    default: module.NewSeriesForm,
  })),
);

const DistributionsPage: FC = () => {
  const [distributionsLength, setDistributionsLength] = useState(0);

  const isLargeScreen = useMediaQuery("(min-width: 620px)");
  const { setSidePanelContent } = useSidePanel();

  const handleAddDistribution = () => {
    setSidePanelContent(
      "Add distribution",
      <Suspense fallback={<LoadingState />}>
        <NewDistributionForm />
      </Suspense>,
    );
  };

  const handleCreateMirror = () => {
    setSidePanelContent(
      "Add new mirror",
      <Suspense fallback={<LoadingState />}>
        <NewSeriesForm />
      </Suspense>,
    );
  };

  const buttons = [
    {
      label: "Add distribution",
      ariaLabel: "Add distribution",
      onClick: handleAddDistribution,
      disabled: false,
      appearance: undefined,
    },
    {
      label: "Add mirror",
      ariaLabel: "Add mirror",
      onClick: handleCreateMirror,
      disabled: distributionsLength === 0,
      appearance: "positive",
    },
  ];

  const largeScreenButtons = buttons.map((item) => (
    <Button
      key={`${item.label}-button`}
      type="button"
      className="u-no-margin--right"
      aria-label={item.ariaLabel}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      appearance={item.appearance}
      disabled={item.disabled}
      onClick={item.onClick}
    >
      {item.label}
    </Button>
  ));

  const contextualMenuLinks: MenuLink[] = buttons.map((item) => ({
    children: item.label,
    "aria-label": item.ariaLabel,
    onClick: item.onClick,
    disabled: item.disabled,
  }));

  return (
    <PageMain>
      <PageHeader
        title="Mirrors"
        actions={
          isLargeScreen
            ? largeScreenButtons
            : [
                <ContextualMenu
                  key="menu"
                  hasToggleIcon
                  toggleLabel="Actions"
                  toggleClassName="u-no-margin--bottom"
                  links={contextualMenuLinks}
                />,
              ]
        }
      />
      <PageContent>
        <DistributionContainer
          onDistributionsLengthChange={(length) => {
            setDistributionsLength(length);
          }}
        />
      </PageContent>
    </PageMain>
  );
};

export default DistributionsPage;
