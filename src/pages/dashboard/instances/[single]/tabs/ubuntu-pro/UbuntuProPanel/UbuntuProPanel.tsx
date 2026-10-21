import {
  UbuntuProEmptyState,
  UbuntuProHeader,
  UbuntuProInfoRow,
  UbuntuProList,
} from "@/features/ubuntupro";
import type { Instance } from "@/types/Instance";
import type { UbuntuProService } from "@/types/Instance";
import type { FC } from "react";

const EMPTY_SERVICES: UbuntuProService[] = [];

interface UbuntuProPanelProps {
  readonly instance: Instance;
}

const UbuntuProPanel: FC<UbuntuProPanelProps> = ({ instance }) => {
  return instance.ubuntu_pro_info?.attached ? (
    <>
      <UbuntuProHeader instance={instance} />
      <UbuntuProInfoRow instance={instance} />
      <UbuntuProList
        services={instance.ubuntu_pro_info.services ?? EMPTY_SERVICES}
        simulated={instance.ubuntu_pro_info.simulated}
      />
    </>
  ) : (
    <UbuntuProEmptyState instance={instance} />
  );
};

export default UbuntuProPanel;
