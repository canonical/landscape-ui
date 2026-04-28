import { type FC } from "react";
import NoPublicationTargetsModal from "../NoPublicationTargetsModal";
import { useGetPublicationTargets } from "@/features/publication-targets";
import usePageParams from "@/hooks/usePageParams";
import type { Local } from "@canonical/landscape-openapi";

interface PublishRepositoryGuardProps {
  readonly close: () => void;
  readonly isOpen: boolean;
  readonly repository: Local;
}

const PublishLocalRepositoryGuard: FC<PublishRepositoryGuardProps> = ({
  close,
  isOpen,
  repository,
}) => {
  const { publicationTargets } = useGetPublicationTargets();
  const { setPageParams } = usePageParams();

  if (isOpen) {
    if (!publicationTargets.length) {
      return <NoPublicationTargetsModal close={close} />;
    }

    setPageParams({ sidePath: ["publish"], name: repository.localId });
  }

  return null;
};

export default PublishLocalRepositoryGuard;
