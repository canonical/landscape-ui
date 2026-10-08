import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import { useOrgSettings } from "@/features/organisation-settings";
import useAuth from "@/hooks/useAuth";
import { boolToLabel } from "@/utils/output";
import type { FC } from "react";

/** The entered account's preferences, read-only. */
const SupportGeneralSettings: FC = () => {
  const { user } = useAuth();
  const { getOrganisationPreferences } = useOrgSettings();
  const { data, isLoading, error } = getOrganisationPreferences();

  if (error) {
    throw error;
  }

  if (isLoading || !data) {
    return <LoadingState />;
  }

  const preferences = data.data;

  return (
    <Blocks>
      <Blocks.Item title="Organization">
        <InfoGrid>
          <InfoGrid.Item label="Account name" value={user?.current_account} />
          <InfoGrid.Item
            label="Organization's name"
            value={preferences.title}
          />
        </InfoGrid>
      </Blocks.Item>
      <Blocks.Item title="Registration">
        <InfoGrid>
          <InfoGrid.Item
            label="Use registration key"
            value={boolToLabel(!!preferences.registration_password)}
          />
          {!!preferences.registration_password && (
            <InfoGrid.Item
              label="Registration key"
              value={preferences.registration_password}
            />
          )}
          <InfoGrid.Item
            label="Auto register new instances"
            value={boolToLabel(preferences.auto_register_new_computers)}
          />
        </InfoGrid>
      </Blocks.Item>
    </Blocks>
  );
};

export default SupportGeneralSettings;
