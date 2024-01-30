import { FC, lazy, Suspense, useState } from "react";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";
import PageContent from "../../../../components/layout/PageContent";
import { Button } from "@canonical/react-components";
import LoadingState from "../../../../components/layout/LoadingState";
import EmptyState from "../../../../components/layout/EmptyState";
import useSidePanel from "../../../../hooks/useSidePanel";
import useDistributions from "../../../../hooks/useDistributions";
import DistributionCard from "./DistributionCard";
import useDebug from "../../../../hooks/useDebug";
import { useMediaQuery } from "usehooks-ts";
import classNames from "classnames";

const NewDistributionForm = lazy(() => import("./NewDistributionForm"));
const NewSeriesForm = lazy(() => import("./NewSeriesForm"));

const DistributionsPage: FC = () => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const isSmall = useMediaQuery("(min-width: 620px)");

  const { setSidePanelContent } = useSidePanel();
  const { getDistributionsQuery } = useDistributions();
  const { data, isLoading, error } = getDistributionsQuery({
    include_latest_sync: true,
  });
  const debug = useDebug();

  if (error) {
    debug(error);
  }

  const distributions = data?.data ?? [];

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
            <NewSeriesForm distributionData={distributions} />
          </Suspense>,
        );
      }}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      type="button"
      className={classNames("u-no-margin--right", className)}
      disabled={0 === distributions.length}
    >
      Create mirror
    </Button>
  );

  return (
    <PageMain>
      <PageHeader
        title="Repository Mirrors"
        actions={
          isSmall
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
        {isLoading && <LoadingState />}
        {!isLoading && distributions.length === 0 && (
          <EmptyState
            title="No mirrors have been created yet"
            icon="containers"
            body={
              <>
                <p className="u-no-margin--bottom">
                  To create a new mirror you must first create a distribution
                </p>
                <a
                  href="https://ubuntu.com/landscape/docs/repositories"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  How to manage repositories in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                key="create-distribution"
                onClick={() => {
                  setSidePanelContent(
                    "Create distribution",
                    <Suspense fallback={<LoadingState />}>
                      <NewDistributionForm />
                    </Suspense>,
                  );
                }}
                type="button"
              >
                Create distribution
              </Button>,
            ]}
          />
        )}
        {!isLoading &&
          distributions.length > 0 &&
          distributions.map((distribution) => (
            <DistributionCard
              key={distribution.name}
              distribution={distribution}
            />
          ))}
      </PageContent>
    </PageMain>
  );
};

export default DistributionsPage;
