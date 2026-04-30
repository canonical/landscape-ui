import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useMemo } from "react";
import {
  useBatchGetLocals,
  useBatchGetMirrors,
  useBatchGetPublicationTargets,
  useGetPublication,
} from "../../api";
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
      <SidePanel.Header>{publication.label}</SidePanel.Header>
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
