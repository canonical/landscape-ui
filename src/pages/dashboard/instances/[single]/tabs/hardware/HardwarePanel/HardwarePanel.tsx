import Blocks from "@/components/layout/Blocks";
import EmptyState from "@/components/layout/EmptyState";
import Menu from "@/components/layout/Menu";
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
        <Menu>
          <Menu.Row>
            <Menu.Row.Item
              label="Model"
              size={3}
              value={groupedHardware.system.model}
            />

            <Menu.Row.Item
              label="Vendor"
              size={3}
              value={groupedHardware.system.vendor}
            />

            <Menu.Row.Item
              label="BIOS vendor"
              size={3}
              value={groupedHardware.system.bios_vendor}
            />

            <Menu.Row.Item
              label="BIOS date"
              size={3}
              value={groupedHardware.system.bios_date}
            />
          </Menu.Row>

          <Menu.Row>
            <Menu.Row.Item
              label="Serial number"
              size={3}
              value={groupedHardware.system.serial}
            />

            <Menu.Row.Item
              label="Chassis"
              size={3}
              value={groupedHardware.system.chassis}
            />

            <Menu.Row.Item
              label="BIOS version"
              size={3}
              value={groupedHardware.system.bios_version}
            />
          </Menu.Row>
        </Menu>
      </HardwareInfoRow>

      <HardwareInfoRow label="Processor">
        {groupedHardware.cpu.length ? (
          <Blocks>
            {groupedHardware.cpu.map((cpu, index) => (
              <Blocks.Item key={index}>
                <Menu.Row>
                  <Menu.Row.Item
                    label="Vendor"
                    size={3}
                    value={cpu.vendor || null}
                  />

                  <Menu.Row.Item
                    label="Clock speed"
                    size={3}
                    value={cpu.clock_speed || null}
                  />

                  <Menu.Row.Item
                    label="Model"
                    size={3}
                    value={cpu.model || null}
                  />

                  <Menu.Row.Item
                    label="Architecture"
                    size={3}
                    value={cpu.architecture || null}
                  />
                </Menu.Row>
              </Blocks.Item>
            ))}
          </Blocks>
        ) : (
          <Menu.Row>
            <Menu.Row.Item label="Vendor" size={3} value={null} />
            <Menu.Row.Item label="Clock speed" size={3} value={null} />
            <Menu.Row.Item label="Model" size={3} value={null} />
            <Menu.Row.Item label="Architecture" size={3} value={null} />
          </Menu.Row>
        )}
      </HardwareInfoRow>

      <HardwareInfoRow label="Memory">
        <Menu.Row>
          <Menu.Row.Item
            label="Size"
            size={3}
            value={groupedHardware.memory.size || null}
          />
        </Menu.Row>
      </HardwareInfoRow>

      <HardwareInfoRow label="Network">
        {typeof groupedHardware.network === "string" ? (
          <Menu.Row>
            <Menu.Row.Item
              label="Network"
              size={3}
              value={groupedHardware.network || null}
            />
          </Menu.Row>
        ) : (
          <Blocks>
            {groupedHardware.network.map((network, index) => (
              <Blocks.Item key={index}>
                <Menu>
                  <Menu.Row>
                    <Menu.Row.Item
                      label="IP address"
                      size={3}
                      value={network.ip || null}
                    />

                    <Menu.Row.Item
                      label="Vendor"
                      size={3}
                      value={network.vendor || null}
                    />

                    <Menu.Row.Item
                      label="Model"
                      size={3}
                      value={network.product || null}
                    />

                    <Menu.Row.Item
                      label="MAC address"
                      size={3}
                      value={network.mac || null}
                    />
                  </Menu.Row>

                  <Menu.Row>
                    <Menu.Row.Item
                      label="Description"
                      size={3}
                      value={network.description || null}
                    />
                  </Menu.Row>
                </Menu>
              </Blocks.Item>
            ))}
          </Blocks>
        )}
      </HardwareInfoRow>

      <HardwareInfoRow label="Multimedia">
        <Menu.Row>
          <Menu.Row.Item
            label="Model"
            size={3}
            value={groupedHardware.multimedia.model || null}
          />

          <Menu.Row.Item
            label="Vendor"
            size={3}
            value={groupedHardware.multimedia.vendor || null}
          />
        </Menu.Row>
      </HardwareInfoRow>
    </>
  );
};

export default HardwarePanel;
