import Blocks from "@/components/layout/Blocks";
import EmptyState from "@/components/layout/EmptyState";
import Grid from "@/components/layout/Grid";
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
        <Grid>
          <Grid.Item
            label="Model"
            size={3}
            value={groupedHardware.system.model}
          />

          <Grid.Item
            label="Vendor"
            size={3}
            value={groupedHardware.system.vendor}
          />

          <Grid.Item
            label="BIOS vendor"
            size={3}
            value={groupedHardware.system.bios_vendor}
          />

          <Grid.Item
            label="BIOS date"
            size={3}
            value={groupedHardware.system.bios_date}
          />

          <Grid.Item
            label="Serial number"
            size={3}
            value={groupedHardware.system.serial}
          />

          <Grid.Item
            label="Chassis"
            size={3}
            value={groupedHardware.system.chassis}
          />

          <Grid.Item
            label="BIOS version"
            size={3}
            value={groupedHardware.system.bios_version}
          />
        </Grid>
      </HardwareInfoRow>

      <HardwareInfoRow label="Processor">
        {groupedHardware.cpu.length ? (
          <Blocks>
            {groupedHardware.cpu.map((cpu, index) => (
              <Blocks.Item key={index}>
                <Grid>
                  <Grid.Item
                    label="Vendor"
                    size={3}
                    value={cpu.vendor || null}
                  />

                  <Grid.Item
                    label="Clock speed"
                    size={3}
                    value={cpu.clock_speed || null}
                  />

                  <Grid.Item label="Model" size={3} value={cpu.model || null} />

                  <Grid.Item
                    label="Architecture"
                    size={3}
                    value={cpu.architecture || null}
                  />
                </Grid>
              </Blocks.Item>
            ))}
          </Blocks>
        ) : (
          <Grid>
            <Grid.Item label="Vendor" size={3} value={null} />
            <Grid.Item label="Clock speed" size={3} value={null} />
            <Grid.Item label="Model" size={3} value={null} />
            <Grid.Item label="Architecture" size={3} value={null} />
          </Grid>
        )}
      </HardwareInfoRow>

      <HardwareInfoRow label="Memory">
        <Grid>
          <Grid.Item
            label="Size"
            size={3}
            value={groupedHardware.memory.size || null}
          />
        </Grid>
      </HardwareInfoRow>

      <HardwareInfoRow label="Network">
        {typeof groupedHardware.network === "string" ? (
          <Grid>
            <Grid.Item
              label="Network"
              size={3}
              value={groupedHardware.network || null}
            />
          </Grid>
        ) : (
          <Blocks>
            {groupedHardware.network.map((network, index) => (
              <Blocks.Item key={index}>
                <Grid>
                  <Grid.Item
                    label="IP address"
                    size={3}
                    value={network.ip || null}
                  />

                  <Grid.Item
                    label="Vendor"
                    size={3}
                    value={network.vendor || null}
                  />

                  <Grid.Item
                    label="Model"
                    size={3}
                    value={network.product || null}
                  />

                  <Grid.Item
                    label="MAC address"
                    size={3}
                    value={network.mac || null}
                  />

                  <Grid.Item
                    label="Description"
                    size={3}
                    value={network.description || null}
                  />
                </Grid>
              </Blocks.Item>
            ))}
          </Blocks>
        )}
      </HardwareInfoRow>

      <HardwareInfoRow label="Multimedia">
        <Grid>
          <Grid.Item
            label="Model"
            size={3}
            value={groupedHardware.multimedia.model || null}
          />

          <Grid.Item
            label="Vendor"
            size={3}
            value={groupedHardware.multimedia.vendor || null}
          />
        </Grid>
      </HardwareInfoRow>
    </>
  );
};

export default HardwarePanel;
