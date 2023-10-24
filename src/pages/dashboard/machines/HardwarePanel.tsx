import { FC } from "react";
import HardwareInfoRow from "./HardwareInfoRow";
import useComputers from "../../../hooks/useComputers";
import { useParams } from "react-router-dom";
import useDebug from "../../../hooks/useDebug";
import { GroupedHardware } from "../../../types/Computer";

const HardwarePanel: FC = () => {
  const { hostname } = useParams();

  const debug = useDebug();

  const { getComputersQuery } = useComputers();

  const { data: getComputersQueryResult, error: getComputersQueryError } =
    getComputersQuery({
      query: `hostname:${hostname}`,
      with_hardware: true,
      with_grouped_hardware: true,
    });

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const groupedHardware: GroupedHardware | undefined =
    getComputersQueryResult?.data[0].grouped_hardware;

  const LABELS = {
    MODEL: "MODEL",
    VENDOR: "VENDOR",
    BIOS_VENDOR: "BIOS VENDOR",
    BIOS_DATE: "BIOS DATE",
    SERIAL_NUMBER: "SERIAL NUMBER",
    CHASSIS: "CHASSIS",
    BIOS_VERSION: "BIOS VERSION",
    IP: "IP",
    MAC_ADDRESS: "MAC_ADDRESS",
    DESCRIPTION: "DESCRIPTION",
    CACHE: "CACHE",
    CLOCK_SPEED: "CLOCK_SPEED",
    ARCHITECTURE: "ARCHITECTURE",
  };

  if (!groupedHardware) {
    return null;
  }

  const systemRow = [
    [
      {
        label: LABELS.MODEL,
        value: groupedHardware.system.model,
      },
      {
        label: LABELS.VENDOR,
        value: groupedHardware.system.vendor,
      },
      {
        label: LABELS.BIOS_VENDOR,
        value: groupedHardware.system.bios_vendor,
      },
      {
        label: LABELS.BIOS_DATE,
        value: groupedHardware.system.bios_date,
      },
      {
        label: LABELS.SERIAL_NUMBER,
        value: groupedHardware.system.serial,
      },
      {
        label: LABELS.CHASSIS,
        value: groupedHardware.system.chassis,
      },
      {
        label: LABELS.BIOS_VERSION,
        value: groupedHardware.system.bios_version,
      },
    ],
  ];

  const memoryRow = [[{ label: "SIZE", value: groupedHardware.memory.size }]];
  const partitionsRow =
    typeof groupedHardware.network === "string"
      ? [[{ label: "Network", value: groupedHardware.network }]]
      : groupedHardware.network.map((network) => {
          return [
            {
              label: LABELS.IP,
              value: network.ip,
            },
            {
              label: LABELS.VENDOR,
              value: network.vendor,
            },
            {
              label: LABELS.VENDOR,
              value: network.product,
            },
            {
              label: LABELS.MAC_ADDRESS,
              value: network.mac,
            },
            {
              label: LABELS.DESCRIPTION,
              value: network.description,
            },
          ];
        });

  const processorRow = groupedHardware.cpu.map((cpu) => {
    return [
      {
        label: LABELS.VENDOR,
        value: cpu.vendor,
      },
      {
        label: LABELS.CACHE,
        value:
          cpu.cache[
            Object.keys(cpu.cache)[0] as
              | "L1 cache"
              | "L2 cache"
              | "L3 cache"
              | "L4 cache"
          ] ?? "Not available",
      },
      {
        label: LABELS.CLOCK_SPEED,
        value: cpu.clock_speed,
      },
      {
        label: LABELS.MODEL,
        value: cpu.model,
      },
      {
        label: LABELS.ARCHITECTURE,
        value: cpu.architecture,
      },
    ];
  });
  const multimediaRow = [
    [
      { label: LABELS.MODEL, value: groupedHardware.multimedia.model },
      { label: LABELS.VENDOR, value: groupedHardware.multimedia.vendor },
    ],
  ];

  return (
    <>
      <HardwareInfoRow infoRowLabel="System" infoBlocksArray={systemRow} />
      <HardwareInfoRow
        infoRowLabel="Processor"
        infoBlocksArray={processorRow}
      />
      <HardwareInfoRow infoRowLabel="Memory" infoBlocksArray={memoryRow} />
      <HardwareInfoRow
        infoRowLabel="Partitions"
        infoBlocksArray={partitionsRow}
      />
      <HardwareInfoRow
        infoRowLabel="Multimedia"
        infoBlocksArray={multimediaRow}
      />
    </>
  );
};

export default HardwarePanel;
