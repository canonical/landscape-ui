import Blocks from "@/components/layout/Blocks";
import EmptyState from "@/components/layout/EmptyState";
import InfoGrid from "@/components/layout/InfoGrid";
import HardwareInfoRow from "@/pages/dashboard/instances/[single]/tabs/hardware/HardwareInfoRow";
import type { Instance } from "@/types/Instance";
import type { FC } from "react";

interface HardwarePanelProps {
  readonly instance: Instance;
}

const HardwarePanel: FC<HardwarePanelProps> = ({ instance }) => {
  const groupedHardware = instance?.grouped_hardware;

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

  return (
    <>
      <HardwareInfoRow label="System">
        <InfoGrid>
          <InfoGrid.Item label="Model" value={groupedHardware.system.model} />

          <InfoGrid.Item label="Vendor" value={groupedHardware.system.vendor} />

          <InfoGrid.Item
            label="BIOS vendor"
            value={groupedHardware.system.bios_vendor}
          />

          <InfoGrid.Item
            label="BIOS date"
            value={groupedHardware.system.bios_date}
          />

          <InfoGrid.Item
            label="Serial number"
            value={groupedHardware.system.serial}
          />

          <InfoGrid.Item
            label="Chassis"
            value={groupedHardware.system.chassis}
          />

          <InfoGrid.Item
            label="BIOS version"
            value={groupedHardware.system.bios_version}
          />
        </InfoGrid>
      </HardwareInfoRow>

      <HardwareInfoRow label="Processor">
        {groupedHardware.cpu.length ? (
          <Blocks>
            {groupedHardware.cpu.map((cpu, index) => (
              <Blocks.Item key={index}>
                <InfoGrid>
                  <InfoGrid.Item label="Vendor" value={cpu.vendor} />

                  <InfoGrid.Item label="Clock speed" value={cpu.clock_speed} />

                  <InfoGrid.Item label="Model" value={cpu.model} />

                  <InfoGrid.Item
                    label="Architecture"
                    value={cpu.architecture}
                  />
                </InfoGrid>
              </Blocks.Item>
            ))}
          </Blocks>
        ) : (
          <InfoGrid>
            <InfoGrid.Item label="Vendor" value={null} />
            <InfoGrid.Item label="Clock speed" value={null} />
            <InfoGrid.Item label="Model" value={null} />
            <InfoGrid.Item label="Architecture" value={null} />
          </InfoGrid>
        )}
      </HardwareInfoRow>

      <HardwareInfoRow label="Memory">
        <InfoGrid>
          <InfoGrid.Item label="Size" value={groupedHardware.memory.size} />
        </InfoGrid>
      </HardwareInfoRow>

      <HardwareInfoRow label="Network">
        {typeof groupedHardware.network === "string" ? (
          <InfoGrid>
            <InfoGrid.Item label="Network" value={groupedHardware.network} />
          </InfoGrid>
        ) : (
          <Blocks>
            {groupedHardware.network.map((network, index) => (
              <Blocks.Item key={index}>
                <InfoGrid>
                  <InfoGrid.Item label="IP address" value={network.ip} />
                  <InfoGrid.Item label="Vendor" value={network.vendor} />
                  <InfoGrid.Item label="Model" value={network.product} />
                  <InfoGrid.Item label="MAC address" value={network.mac} />
                  <InfoGrid.Item
                    label="Description"
                    value={network.description}
                  />
                </InfoGrid>
              </Blocks.Item>
            ))}
          </Blocks>
        )}
      </HardwareInfoRow>

      <HardwareInfoRow label="Multimedia">
        <InfoGrid>
          <InfoGrid.Item
            label="Model"
            value={groupedHardware.multimedia.model}
          />
          <InfoGrid.Item
            label="Vendor"
            value={groupedHardware.multimedia.vendor}
          />
        </InfoGrid>
      </HardwareInfoRow>
    </>
  );
};

export default HardwarePanel;
