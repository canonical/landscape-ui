import { FC } from "react";
import HardwareInfoRow from "./HardwareInfoRow";
import { useComputers } from "../../../hooks/useComputers";
import { useParams } from "react-router-dom";
import useDebug from "../../../hooks/useDebug";

const HardwarePanel: FC = () => {
  const { hostname } = useParams();

  const debug = useDebug();

  const { getComputersQuery } = useComputers();

  const { data: getComputersQueryResult, error: getComputersQueryError } =
    getComputersQuery({
      query: `hostname:${hostname}`,
      with_hardware: true,
    });

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const hardware = getComputersQueryResult?.data[0].hardware ?? [];

  const getHardwareInfo = (attribute: string) => {
    const hardwareDescription = hardware.find(
      ([hardwareAttribute]) => hardwareAttribute === attribute
    );

    return hardwareDescription ? hardwareDescription[1] : "Not available";
  };

  return (
    <>
      <HardwareInfoRow
        infoRowLabel="System"
        infoBlocksArray={[
          [
            { label: "Model", value: getHardwareInfo("product") },
            { label: "Vendor", value: getHardwareInfo("vendor") },
            {
              label: "Bios vendor",
              value: getHardwareInfo("firmware.vendor"),
            },
            { label: "Bios Date", value: getHardwareInfo("firmware.date") },
            { label: "Serial Number", value: getHardwareInfo("serial") },
            { label: "Chassis", value: getHardwareInfo("firmware.vendor") },
            {
              label: "Bios Version",
              value: getHardwareInfo("firmware.version"),
            },
          ],
        ]}
      />
    </>
  );
};

export default HardwarePanel;
