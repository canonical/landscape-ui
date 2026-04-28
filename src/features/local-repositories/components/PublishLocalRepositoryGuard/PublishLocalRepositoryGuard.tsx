import { type FC } from "react";
import {
  NoPublicationTargetsModal,
  useGetPublicationTargets,
} from "@/features/publication-targets";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import type { Local } from "../../types";

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

  setPageParams({ sidePath: ["publish"], name: repository.local_id });

  return null;
};

export default PublishLocalRepositoryGuard;
