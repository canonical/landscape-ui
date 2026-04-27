import { type FC } from "react";
import NoPublicationTargetsModal from "../NoPublicationTargetsModal";
import { useGetPublicationTargets } from "@/features/publication-targets";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import type { Local } from "@canonical/landscape-openapi";

interface PublishRepositoryGuardProps {
  readonly close: () => void;
  readonly repository: Local;
}

const PublishLocalRepositoryGuard: FC<PublishRepositoryGuardProps> = ({
  close,
  repository,
}) => {
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { setPageParams } = usePageParams();

  if (isGettingPublicationTargets) {
    return <LoadingState />;
  }

  if (!publicationTargets.length) {
    return <NoPublicationTargetsModal close={close} />;
  }

  setPageParams({ sidePath: ["publish"], name: repository.localId });

  return null;
};

export default PublishLocalRepositoryGuard;
