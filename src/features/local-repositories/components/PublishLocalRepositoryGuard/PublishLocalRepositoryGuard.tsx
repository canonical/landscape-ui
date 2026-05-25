import { type FC } from "react";
import {
  NoPublicationTargetsModal,
  useGetPublicationTargets,
} from "@/features/publication-targets";
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
  const { sidePath, createPageParamsSetter, createSidePathPusher } =
    usePageParams();

  const openSidePanel = !sidePath.length
    ? createPageParamsSetter({
        sidePath: ["publish"],
        name: repository.localId,
      })
    : createSidePathPusher("publish");

  if (isOpen) {
    if (!publicationTargets.length) {
      return <NoPublicationTargetsModal close={close} />;
    }

    if (!sidePath.includes("publish")) {
      openSidePanel();
    }
  }

  return null;
};

export default PublishLocalRepositoryGuard;
