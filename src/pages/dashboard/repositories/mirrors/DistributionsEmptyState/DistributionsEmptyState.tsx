import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const NewDistributionForm = lazy(
  () => import("@/pages/dashboard/repositories/mirrors/NewDistributionForm"),
);

const DistributionsEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreateDistribution = () => {
    setSidePanelContent(
      "Create distribution",
      <Suspense fallback={<LoadingState />}>
        <NewDistributionForm />
      </Suspense>,
    );
  };

  return (
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
          onClick={handleCreateDistribution}
          type="button"
        >
          Create distribution
        </Button>,
      ]}
    />
  );
};

export default DistributionsEmptyState;
