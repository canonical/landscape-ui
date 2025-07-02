import NoData from "@/components/layout/NoData";
import type { GroupedHardware } from "@/types/Instance";

const getSystemInfo = (groupedHardware: GroupedHardware | undefined) => {
  return [
    [
      {
        label: "MODEL",
        value: groupedHardware?.system.model || <NoData />,
      },
      {
        label: "VENDOR",
        value: groupedHardware?.system.vendor || <NoData />,
      },
      {
        label: "BIOS VENDOR",
        value: groupedHardware?.system.bios_vendor || <NoData />,
      },
      {
        label: "BIOS DATE",
        value: groupedHardware?.system.bios_date || <NoData />,
      },
      {
        label: "SERIAL NUMBER",
        value: groupedHardware?.system.serial || <NoData />,
      },
      {
        label: "CHASSIS",
        value: groupedHardware?.system.chassis || <NoData />,
      },
      {
        label: "BIOS VERSION",
        value: groupedHardware?.system.bios_version || <NoData />,
      },
    ],
  ];
};

const getMemoryInfo = (groupedHardware: GroupedHardware | undefined) => {
  return [
    [{ label: "SIZE", value: groupedHardware?.memory.size || <NoData /> }],
  ];
};

const getNetworkInfo = (groupedHardware: GroupedHardware | undefined) => {
  if (!groupedHardware?.network) {
    return [[{ label: "Network", value: <NoData /> }]];
  }

  return typeof groupedHardware.network === "string"
    ? [[{ label: "Network", value: groupedHardware.network }]]
    : groupedHardware.network.map((network) => {
        return [
          {
            label: "IP",
            value: network.ip || <NoData />,
          },
          {
            label: "VENDOR",
            value: network.vendor || <NoData />,
          },
          {
            label: "MODEL",
            value: network.product || <NoData />,
          },
          {
            label: "MAC ADDRESS",
            value: network.mac || <NoData />,
          },
          {
            label: "DESCRIPTION",
            value: network.description || <NoData />,
          },
        ];
      });
};

const getProcessorInfo = (groupedHardware: GroupedHardware | undefined) => {
  if (!groupedHardware?.cpu) {
    return [
      [
        { label: "VENDOR", value: <NoData /> },
        { label: "CLOCK SPEED", value: <NoData /> },
        { label: "MODEL", value: <NoData /> },
        { label: "ARCHITECTURE", value: <NoData /> },
      ],
    ];
  }

  return groupedHardware.cpu.map((cpu) => {
    const processorArray = [
      {
        label: "VENDOR",
        value: cpu.vendor || <NoData />,
      },
      {
        label: "CLOCK SPEED",
        value: cpu.clock_speed || <NoData />,
      },
      {
        label: "MODEL",
        value: cpu.model || <NoData />,
      },
      {
        label: "ARCHITECTURE",
        value: cpu.architecture || <NoData />,
      },
    ];
    if (Object.keys(cpu.cache).length > 0) {
      processorArray.push(
        ...Object.entries(cpu.cache).map(([key, value]) => {
          return {
            label: key,
            value: value,
          };
        }),
      );
    } else {
      processorArray.push({
        label: "CACHE",
        value: "Not available",
      });
    }
    return processorArray;
  });
};

const getMultimediaInfo = (groupedHardware: GroupedHardware | undefined) => {
  return [
    [
      {
        label: "MODEL",
        value: groupedHardware?.multimedia.model || <NoData />,
      },
      {
        label: "VENDOR",
        value: groupedHardware?.multimedia.vendor || <NoData />,
      },
    ],
  ];
};

export const getHardwareInfo = (
  groupedHardware: GroupedHardware | undefined,
) => {
  return {
    memory: getMemoryInfo(groupedHardware),
    multimedia: getMultimediaInfo(groupedHardware),
    network: getNetworkInfo(groupedHardware),
    processor: getProcessorInfo(groupedHardware),
    system: getSystemInfo(groupedHardware),
  };
};
