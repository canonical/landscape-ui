import classNames from "classnames";
import { FC, lazy, Suspense, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSidePanel from "@/hooks/useSidePanel";
import DistributionContainer from "@/pages/dashboard/repositories/mirrors/DistributionContainer";

const NewDistributionForm = lazy(
  () => import("@/pages/dashboard/repositories/mirrors/NewDistributionForm"),
);
const NewSeriesForm = lazy(
  () => import("@/pages/dashboard/repositories/mirrors/NewSeriesForm"),
);

const DistributionsPage: FC = () => {
  const [distributionsLength, setDistributionsLength] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);

  const isLargeScreen = useMediaQuery("(min-width: 620px)");

  const { setSidePanelContent } = useSidePanel();

  const AddDistributionButton = ({ className }: { className?: string }) => (
    <Button
      onClick={() => {
        setSidePanelContent(
          "Create distribution",
          <Suspense fallback={<LoadingState />}>
            <NewDistributionForm />
          </Suspense>,
        );
      }}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      type="button"
      className={classNames("u-no-margin--right", className)}
    >
      Create distribution
    </Button>
  );

  const CreateMirrorButton = ({ className }: { className?: string }) => (
    <Button
      appearance="positive"
      onClick={() => {
        setSidePanelContent(
          "Create new mirror",
          <Suspense fallback={<LoadingState />}>
            <NewSeriesForm />
          </Suspense>,
        );
      }}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      type="button"
      className={classNames("u-no-margin--right", className)}
      disabled={0 === distributionsLength}
    >
      Create mirror
    </Button>
  );

  return (
    <PageMain>
      <PageHeader
        title="Repository Mirrors"
        actions={
          isLargeScreen
            ? [
                <AddDistributionButton key="create-distribution-button" />,
                <CreateMirrorButton key="create-mirror-button" />,
              ]
            : [
                <span className="p-contextual-menu" key="menu">
                  <Button
                    className="p-contextual-menu__toggle u-no-margin--bottom"
                    aria-controls="menu"
                    aria-expanded={openDropdown}
                    aria-haspopup="true"
                    onClick={() => {
                      setOpenDropdown((prevState) => !prevState);
                    }}
                    onBlur={() => {
                      setOpenDropdown(false);
                    }}
                  >
                    Actions
                  </Button>
                  <span
                    className="p-contextual-menu__dropdown"
                    id="menu"
                    aria-hidden={!openDropdown}
                  >
                    <AddDistributionButton className="p-contextual-menu__link" />
                    <CreateMirrorButton className="p-contextual-menu__link" />
                  </span>
                </span>,
              ]
        }
      />
      <PageContent>
        <DistributionContainer
          onDistributionsLengthChange={(length) =>
            setDistributionsLength(length)
          }
        />
      </PageContent>
    </PageMain>
  );
};

export default DistributionsPage;
