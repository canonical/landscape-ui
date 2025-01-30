import type { FC } from "react";
import HardwareInfoRow from "@/pages/dashboard/instances/[single]/tabs/hardware/HardwareInfoRow";
import type { Instance } from "@/types/Instance";
import { getHardwareInfo } from "./helpers";

interface HardwarePanelProps {
  readonly instance: Instance;
}

const HardwarePanel: FC<HardwarePanelProps> = ({ instance }) => {
  const groupedHardware = instance.grouped_hardware;

  if (!groupedHardware) {
    return null;
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
        infoRowLabel="Partitions"
        infoBlocksArray={hardwareInfo.partitions}
      />
      <HardwareInfoRow
        infoRowLabel="Multimedia"
        infoBlocksArray={hardwareInfo.multimedia}
      />
    </>
  );
};

export default HardwarePanel;
