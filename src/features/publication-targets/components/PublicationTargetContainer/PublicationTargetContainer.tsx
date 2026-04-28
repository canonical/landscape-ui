import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import useGetPublicationTargets from "../../api/useGetPublicationTargets";
import PublicationTargetList from "../PublicationTargetList";

const PublicationTargetContainer: FC = () => {
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();

  if (isGettingPublicationTargets) {
    return <LoadingState />;
  }

  return <PublicationTargetList targets={publicationTargets} />;
};

export default PublicationTargetContainer;
