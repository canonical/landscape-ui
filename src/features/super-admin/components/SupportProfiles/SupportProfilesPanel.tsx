import SidePanel from "@/components/layout/SidePanel";
import {
  type Profile,
  type ProfileTypes,
  usesNameAsIdentifier,
} from "@/features/profiles";
import usePageParams from "@/hooks/usePageParams";
import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import SupportProfilesList from "../SupportProfilesList";

interface SupportProfilesPanelProps {
  readonly type: ProfileTypes;
  readonly profiles: Profile[];
  readonly isPending: boolean;
  /** The list request's failure, surfaced instead of an empty list. */
  readonly error?: Error | null;
  /**
   * The selected profile's details, mounted only once the `name` page param
   * names one of `profiles`: its lookup must not run for a stale selection.
   */
  readonly details: ReactNode;
}

/** A read-only profile list with the details of the selected one in a side panel. */
const SupportProfilesPanel: FC<SupportProfilesPanelProps> = ({
  type,
  profiles,
  isPending,
  error,
  details,
}) => {
  const {
    name: selectedProfile,
    lastSidePathSegment,
    popSidePathUntilClear,
    closeSidePanel,
  } = usePageParams();

  const isSelectionListed = profiles.some(
    (profile) =>
      (usesNameAsIdentifier(profile) ? profile.name : `${profile.id}`) ===
      selectedProfile,
  );
  const hasStaleSelection =
    !isPending && !!selectedProfile && !isSelectionListed;

  // A selection the list does not know (a deep link, a name left behind by
  // another profile type) is dropped rather than looked up.
  useEffect(() => {
    if (hasStaleSelection) {
      closeSidePanel();
    }
  }, [hasStaleSelection, closeSidePanel]);

  if (error) {
    throw error;
  }

  const isViewing = lastSidePathSegment === "view" && isSelectionListed;

  return (
    <>
      <SupportProfilesList
        type={type}
        profiles={profiles}
        isPending={isPending}
      />
      <SidePanel onClose={popSidePathUntilClear} isOpen={isViewing}>
        {isViewing && (
          <SidePanel.Suspense key="view">{details}</SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default SupportProfilesPanel;
