import type { FC } from "react";
import { getHardwareInfo } from "./helpers";
import { EmptyState } from "@landscape/ui";
import type { Instance } from "@landscape/types";
import { HardwareInfoRow } from "./components";

interface HardwarePanelProps {
  readonly instance: Instance;
}

const HardwarePanel: FC<HardwarePanelProps> = ({ instance }) => {
  const groupedHardware = instance?.grouped_hardware;
  console.log("groupedHardware", instance);
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
