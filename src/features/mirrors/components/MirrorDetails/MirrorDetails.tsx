import { useState, type FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import { Tabs } from "@canonical/react-components";
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

const MirrorDetails: FC = () => {
  const { name } = usePageParams();
  const { mirror, isGettingMirror } = useGetMirror(name);

  const [tabId, setTabId] = useState<"details" | "packages">("details");

  const { operation } = useGetOperation(mirror?.lastOperation ?? "", {
    refetchInterval: ({ state }) =>
      state.error || state.data?.data?.done ? false : DEFAULT_POLLING_INTERVAL,
  });

  const tabs: { label: string; id: "details" | "packages" }[] = [
    {
      label: "General details",
      id: "details",
    },
    {
      label: "Packages",
      id: "packages",
    },
  ];

  const links = tabs.map(({ label, id }) => ({
    label,
    active: tabId == id,
    onClick: () => {
      setTabId(id);
    },
  }));

  if (isGettingMirror) {
    return <SidePanel.LoadingState />;
  }
  if (!mirror) {
    throw new Error(`Mirror ${name} was not found`);
  }

  return (
    <>
      <SidePanel.Header>{mirror.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <OperationStatusNotification operation={operation} type="update" />
        <MirrorDetailsActionBlock
          mirror={mirror}
          isUpdating={!!operation && !operation.done}
        />
        <Tabs links={links} />
        {tabId === "details" && (
          <MirrorDetailsTab mirror={mirror} operation={operation} />
        )}
        {tabId === "packages" && mirror.name && (
          <MirrorPackagesList mirrorName={mirror.name} />
        )}
      </SidePanel.Content>
    </>
  );
};

export default MirrorDetails;
