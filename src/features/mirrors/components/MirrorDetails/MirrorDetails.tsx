import { type FC } from "react";
import AppTabs from "@/components/AppTabs";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import { useGetMirror } from "../../api";
import usePageParams from "@/hooks/usePageParams";
import { DEFAULT_POLLING_INTERVAL } from "@/constants";
import MirrorDetailsActionBlock from "./components/MirrorDetailsActionBlock";
import MirrorDetailsTab from "./components/MirrorDetailsTab";
import MirrorPackagesList from "../MirrorPackagesList";
import {
  useGetOperation,
  OperationStatusNotification,
} from "@/features/operations";
import LoadingState from "@/components/layout/LoadingState";

const MirrorDetails: FC = () => {
  const { name } = usePageParams();
  const { mirror, isGettingMirror } = useGetMirror(name);

  const { operation, isGettingOperation } = useGetOperation(
    mirror?.lastOperation ?? "",
    {
      refetchInterval: ({ state }) =>
        state.error || state.data?.data?.done
          ? false
          : DEFAULT_POLLING_INTERVAL,
    },
  );

  if (isGettingMirror) {
    return <SidePanel.LoadingState />;
  }
  if (!mirror) {
    throw new Error(`Mirror ${name} was not found`);
  }

  return (
    <>
      <SidePanel.Header>{mirror.displayName}</SidePanel.Header>
      {mirror.lastOperation && isGettingOperation ? (
        <LoadingState />
      ) : (
        <SidePanel.Content>
          <OperationStatusNotification operation={operation} type="update" />
          <MirrorDetailsActionBlock
            mirror={mirror}
            isUpdating={!!operation && !operation.done}
          />
          <AppTabs
            aria-label="Mirror details"
            slot="panel"
            items={[
              {
                id: "details",
                label: "General details",
                panel: (
                  <MirrorDetailsTab mirror={mirror} operation={operation} />
                ),
              },
              {
                id: "packages",
                label: "Packages",
                panel: mirror.name ? (
                  <MirrorPackagesList mirrorName={mirror.name} />
                ) : undefined,
              },
            ]}
          />
        </SidePanel.Content>
      )}
    </>
  );
};

export default MirrorDetails;
