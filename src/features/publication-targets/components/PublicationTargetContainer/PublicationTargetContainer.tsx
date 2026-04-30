import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import useGetPublicationTargets from "../../api/useGetPublicationTargets";
import PublicationTargetList from "../PublicationTargetList";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";

const PublicationTargetContainer: FC = () => {
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();

  if (isGettingPublicationTargets) {
    return <LoadingState />;
  }

  return (
    <>
      <HeaderWithSearch />
      <PublicationTargetList targets={publicationTargets} />
    </>
  );
};

export default PublicationTargetContainer;
