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
          <InfoGrid.Item
            label="Model"
            size={3}
            value={groupedHardware.system.model}
          />

          <InfoGrid.Item
            label="Vendor"
            size={3}
            value={groupedHardware.system.vendor}
          />

          <InfoGrid.Item
            label="BIOS vendor"
            size={3}
            value={groupedHardware.system.bios_vendor}
          />

          <InfoGrid.Item
            label="BIOS date"
            size={3}
            value={groupedHardware.system.bios_date}
          />

          <InfoGrid.Item
            label="Serial number"
            size={3}
            value={groupedHardware.system.serial}
          />

          <InfoGrid.Item
            label="Chassis"
            size={3}
            value={groupedHardware.system.chassis}
          />

          <InfoGrid.Item
            label="BIOS version"
            size={3}
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
                  <InfoGrid.Item
                    label="Vendor"
                    size={3}
                    value={cpu.vendor || null}
                  />

                  <InfoGrid.Item
                    label="Clock speed"
                    size={3}
                    value={cpu.clock_speed || null}
                  />

                  <InfoGrid.Item
                    label="Model"
                    size={3}
                    value={cpu.model || null}
                  />

                  <InfoGrid.Item
                    label="Architecture"
                    size={3}
                    value={cpu.architecture || null}
                  />
                </InfoGrid>
              </Blocks.Item>
            ))}
          </Blocks>
        ) : (
          <InfoGrid>
            <InfoGrid.Item label="Vendor" size={3} value={null} />
            <InfoGrid.Item label="Clock speed" size={3} value={null} />
            <InfoGrid.Item label="Model" size={3} value={null} />
            <InfoGrid.Item label="Architecture" size={3} value={null} />
          </InfoGrid>
        )}
      </HardwareInfoRow>

      <HardwareInfoRow label="Memory">
        <InfoGrid>
          <InfoGrid.Item
            label="Size"
            size={3}
            value={groupedHardware.memory.size || null}
          />
        </InfoGrid>
      </HardwareInfoRow>

      <HardwareInfoRow label="Network">
        {typeof groupedHardware.network === "string" ? (
          <InfoGrid>
            <InfoGrid.Item
              label="Network"
              size={3}
              value={groupedHardware.network || null}
            />
          </InfoGrid>
        ) : (
          <Blocks>
            {groupedHardware.network.map((network, index) => (
              <Blocks.Item key={index}>
                <InfoGrid>
                  <InfoGrid.Item
                    label="IP address"
                    size={3}
                    value={network.ip || null}
                  />

                  <InfoGrid.Item
                    label="Vendor"
                    size={3}
                    value={network.vendor || null}
                  />

                  <InfoGrid.Item
                    label="Model"
                    size={3}
                    value={network.product || null}
                  />

                  <InfoGrid.Item
                    label="MAC address"
                    size={3}
                    value={network.mac || null}
                  />

                  <InfoGrid.Item
                    label="Description"
                    size={3}
                    value={network.description || null}
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
            size={3}
            value={groupedHardware.multimedia.model || null}
          />

          <InfoGrid.Item
            label="Vendor"
            size={3}
            value={groupedHardware.multimedia.vendor || null}
          />
        </InfoGrid>
      </HardwareInfoRow>
    </>
  );
};

export default HardwarePanel;
