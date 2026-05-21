import {
  UbuntuProEmptyState,
  UbuntuProHeader,
  UbuntuProInfoRow,
  UbuntuProList,
} from "@/features/ubuntupro";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import type { Instance } from "@/types/Instance";
import type { FC } from "react";
import { lazy } from "react";
import { pluralizeWithCount } from "@/utils/_helpers";

const AttachTokenForm = lazy(
  async () => import("@/features/ubuntupro/components/AttachTokenForm"),
);
const ReplaceTokenForm = lazy(
  async () => import("@/features/ubuntupro/components/ReplaceTokenForm"),
);

interface UbuntuProPanelProps {
  readonly instance: Instance;
}

const UbuntuProPanel: FC<UbuntuProPanelProps> = ({ instance }) => {
  const { lastSidePathSegment, popSidePathUntilClear } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["attach-token", "replace-token"]);

  return (
    <>
      {instance.ubuntu_pro_info?.attached ? (
        <>
          <UbuntuProHeader instance={instance} />
          <UbuntuProInfoRow instance={instance} />
          <UbuntuProList services={instance.ubuntu_pro_info.services} />
        </>
      ) : (
        <UbuntuProEmptyState instance={instance} />
      )}

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "attach-token" ||
          lastSidePathSegment === "replace-token"
        }
        size="small"
      >
        {lastSidePathSegment === "attach-token" && (
          <SidePanel.Suspense key="attach-token">
            <SidePanel.Header>
              Attach Ubuntu Pro token to 1 instance
            </SidePanel.Header>
            <SidePanel.Content>
              <AttachTokenForm selectedInstances={[instance]} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "replace-token" && (
          <SidePanel.Suspense key="replace-token">
            <SidePanel.Header>
              Replace Ubuntu Pro token for 1 instance
            </SidePanel.Header>
            <SidePanel.Content>
              <ReplaceTokenForm selectedInstances={[instance]} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default UbuntuProPanel;
