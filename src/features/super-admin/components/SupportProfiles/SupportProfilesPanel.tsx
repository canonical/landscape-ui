import SidePanel from "@/components/layout/SidePanel";
import type { Profile, ProfileTypes } from "@/features/profiles";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import SupportProfileSidePanel from "../SupportProfileSidePanel";
import SupportProfilesList from "../SupportProfilesList";

interface SupportProfilesPanelProps {
  readonly type: ProfileTypes;
  readonly profiles: Profile[];
  readonly isPending: boolean;
  /** The profile the `name` page param names, once loaded. */
  readonly profile: Profile | undefined;
}

/** A read-only profile list with the details of the selected one in a side panel. */
const SupportProfilesPanel: FC<SupportProfilesPanelProps> = ({
  type,
  profiles,
  isPending,
  profile,
}) => {
  const { lastSidePathSegment, popSidePathUntilClear } = usePageParams();

  return (
    <>
      <SupportProfilesList
        type={type}
        profiles={profiles}
        isPending={isPending}
      />
      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={lastSidePathSegment === "view"}
      >
        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <SupportProfileSidePanel type={type} profile={profile} />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default SupportProfilesPanel;
