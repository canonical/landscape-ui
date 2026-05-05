import SidePanel from "@/components/layout/SidePanel";
import { useBatchGetLocals } from "@/features/local-repositories";
import { useBatchGetMirrors } from "@/features/mirrors";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useMemo } from "react";
import { useBatchGetPublicationTargets } from "@/features/publication-targets";
import { useGetPublication } from "../../api";
import { getPublicationTargetName, getSourceName } from "../../helpers";
import PublicationDetails from "../PublicationDetails";

const PublicationDetailsSidePanel: FC = () => {
  const { name: publicationId } = usePageParams();
  const { publication, isGettingPublication } =
    useGetPublication(publicationId);

  const publicationTargetNames = useMemo(
    () => (publication ? [publication.publicationTarget] : []),
    [publication],
  );

  const mirrorNames = useMemo(
    () =>
      publication?.source.startsWith("mirrors/") ? [publication.source] : [],
    [publication],
  );

  const localNames = useMemo(
    () =>
      publication?.source.startsWith("locals/") ? [publication.source] : [],
    [publication],
  );

  const { publicationTargetDisplayNames } = useBatchGetPublicationTargets(
    publicationTargetNames,
  );
  const { mirrorDisplayNames } = useBatchGetMirrors(mirrorNames);
  const { localDisplayNames } = useBatchGetLocals(localNames);

  const sourceDisplayNames = { ...mirrorDisplayNames, ...localDisplayNames };

  if (isGettingPublication || !publication) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>{publication.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <PublicationDetails
          publication={publication}
          sourceDisplayName={
            sourceDisplayNames[publication.source] ??
            getSourceName(publication.source)
          }
          publicationTargetDisplayName={
            publicationTargetDisplayNames[publication.publicationTarget] ??
            getPublicationTargetName(publication.publicationTarget)
          }
        />
      </SidePanel.Content>
    </>
  );
};

export default PublicationDetailsSidePanel;
