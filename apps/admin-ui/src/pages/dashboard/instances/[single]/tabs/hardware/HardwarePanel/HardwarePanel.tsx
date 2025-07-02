import EmptyState from "@/components/layout/EmptyState";
import HardwareInfoRow from "@/pages/dashboard/instances/[single]/tabs/hardware/HardwareInfoRow";
import type { Instance } from "@/types/Instance";
import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useParams } from "react-router";
import { getHardwareInfo } from "./helpers";

interface HardwarePanelProps {
  readonly instance: Instance;
}

const HardwarePanel: FC<HardwarePanelProps> = ({ instance }) => {
  const groupedHardware = instance?.grouped_hardware;
  const { childInstanceId } = useParams<UrlParams>();

  if (childInstanceId) {
    return (
      <EmptyState
        title="Hardware information unavailable"
        icon="connected"
        body={
          <>
            <p className="u-no-margin--bottom">
              Hardware information is not available for WSL instances.
            </p>
          </>
        }
      />
    );
  }

  if (!groupedHardware) {
    return (
      <EmptyState
        title="Hardware information unavailable"
        icon="connected"
        body={
          <>
            <p className="u-no-margin--bottom">
              Your hardware reporting monitor may be turned off.
            </p>
          </>
        }
      />
    );
  }

  const hardwareInfo = getHardwareInfo(groupedHardware);

  return (
    <>
      <HardwareInfoRow
        infoRowLabel="System"
        infoBlocksArray={hardwareInfo.system}
      />
      <HardwareInfoRow
        infoRowLabel="Processor"
        infoBlocksArray={hardwareInfo.processor}
      />
      <HardwareInfoRow
        infoRowLabel="Memory"
        infoBlocksArray={hardwareInfo.memory}
      />
      <HardwareInfoRow
        infoRowLabel="Network"
        infoBlocksArray={hardwareInfo.network}
      />
      <HardwareInfoRow
        infoRowLabel="Multimedia"
        infoBlocksArray={hardwareInfo.multimedia}
      />
    </>
  );
};

export default HardwarePanel;
