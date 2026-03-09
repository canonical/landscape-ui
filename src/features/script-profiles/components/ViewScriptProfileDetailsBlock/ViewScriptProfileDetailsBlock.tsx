import InfoGrid from "@/components/layout/InfoGrid";
import type { FC } from "react";
import type { ScriptProfile } from "../../types";
import { Link } from "react-router";
import { ROUTES } from "@/libs/routes";
import { Spinner } from "@canonical/react-components";
import { useGetSingleScript } from "@/features/scripts";

interface ViewScriptProfileDetailsBlockProps {
  readonly profile: ScriptProfile;
}

const ViewScriptProfileDetailsBlock: FC<ViewScriptProfileDetailsBlockProps> = ({
  profile,
}) => {
  const { script } = useGetSingleScript(profile.script_id);

  return (
    <>
      <InfoGrid.Item
        label="Script"
        value={ script
          ? <Link
              to={ROUTES.scripts.root({ tab: "scripts" })}
              state={{ scriptId: script.id }}
            >
              {script.title}
            </Link>
          : <>
            <span className="u-off-screen">Loading...</span>
            <Spinner aria-hidden />
          </>
        }
      />

      <InfoGrid.Item label="Run as User" value={profile.username} />

      <InfoGrid.Item label="Time limit" value={`${profile.time_limit}s`} />
    </>
  );
};

export default ViewScriptProfileDetailsBlock;
