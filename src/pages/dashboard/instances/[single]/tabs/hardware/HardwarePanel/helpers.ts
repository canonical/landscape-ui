import { GroupedHardware } from "@/types/Instance";

const getSystemInfo = (groupedHardware: GroupedHardware) => {
  return [
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
};

const getMemoryInfo = (groupedHardware: GroupedHardware) => {
  return [[{ label: "SIZE", value: groupedHardware.memory.size }]];
};

const getPartitionsInfo = (groupedHardware: GroupedHardware) => {
  return typeof groupedHardware.network === "string"
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
};

const getProcessorInfo = (groupedHardware: GroupedHardware) => {
  return groupedHardware.cpu.map((cpu) => {
    const processorArray = [
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

const getMultimediaInfo = (groupedHardware: GroupedHardware) => {
  return [
    [
      { label: "MODEL", value: groupedHardware.multimedia.model },
      { label: "VENDOR", value: groupedHardware.multimedia.vendor },
    ],
  ];
};

export const getHardwareInfo = (groupedHardware: GroupedHardware) => {
  return {
    memory: getMemoryInfo(groupedHardware),
    multimedia: getMultimediaInfo(groupedHardware),
    partitions: getPartitionsInfo(groupedHardware),
    processor: getProcessorInfo(groupedHardware),
    system: getSystemInfo(groupedHardware),
  };
};
