import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import useGetPublicationTargets from "../../api/useGetPublicationTargets";
import PublicationTargetAddButton from "../PublicationTargetAddButton";
import PublicationTargetList from "../PublicationTargetList";

const PublicationTargetContainer: FC = () => {
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();

  if (isGettingPublicationTargets) {
    return <LoadingState />;
  }

  if (publicationTargets.length === 0) {
    return (
      <EmptyState
        title="You don't have any publication targets yet"
        // icon="connected"
        body={
          <>
            <p className="u-no-margin--bottom">
              On this page you will find all publication targets that you create to publish mirrors to.
            </p>
            <a
              href="https://documentation.ubuntu.com/landscape/explanation/features/repository-mirroring"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Learn more about repository mirroring
            </a>
          </>
        }
        cta={[<PublicationTargetAddButton key="add" />]}
      />
    );
  }

  return <PublicationTargetList targets={publicationTargets} />;
};

export default PublicationTargetContainer;
