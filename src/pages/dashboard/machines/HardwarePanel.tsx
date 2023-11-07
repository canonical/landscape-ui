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

  if (!groupedHardware) {
    return null;
  }

  const systemRow = [
    [
      {
        label: "MODEL",
        value: groupedHardware.system.model,
      },
      {
        label: "VENDOR",
        value: groupedHardware.system.vendor,
      },
      {
        label: "BIOS VENDOR",
        value: groupedHardware.system.bios_vendor,
      },
      {
        label: "BIOS DATE",
        value: groupedHardware.system.bios_date,
      },
      {
        label: "SERIAL NUMBER",
        value: groupedHardware.system.serial,
      },
      {
        label: "CHASSIS",
        value: groupedHardware.system.chassis,
      },
      {
        label: "BIOS VERSION",
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
              label: "IP",
              value: network.ip,
            },
            {
              label: "VENDOR",
              value: network.vendor,
            },
            {
              label: "VENDOR",
              value: network.product,
            },
            {
              label: "MAC ADDRESS",
              value: network.mac,
            },
            {
              label: "DESCRIPTION",
              value: network.description,
            },
          ];
        });

  const processorRow = groupedHardware.cpu.map((cpu) => {
    const arrayToReturn = [
      {
        label: "VENDOR",
        value: cpu.vendor,
      },
      {
        label: "CLOCK SPEED",
        value: cpu.clock_speed,
      },
      {
        label: "MODEL",
        value: cpu.model,
      },
      {
        label: "ARCHITECTURE",
        value: cpu.architecture,
      },
    ];
    if (Object.keys(cpu.cache).length > 0) {
      arrayToReturn.push(
        ...Object.entries(cpu.cache).map(([key, value]) => {
          return {
            label: key,
            value: value,
          };
        }),
      );
    } else {
      arrayToReturn.push({
        label: "CACHE",
        value: "Not available",
      });
    }
    return arrayToReturn;
  });
  const multimediaRow = [
    [
      { label: "MODEL", value: groupedHardware.multimedia.model },
      { label: "VENDOR", value: groupedHardware.multimedia.vendor },
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
