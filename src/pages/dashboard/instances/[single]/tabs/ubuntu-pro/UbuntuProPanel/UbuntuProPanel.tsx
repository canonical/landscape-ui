import {
  UbuntuProEmptyState,
  UbuntuProHeader,
  UbuntuProInfoRow,
  UbuntuProList,
} from "@/features/ubuntupro";
import type { Instance } from "@/types/Instance";
import type { FC } from "react";

interface UbuntuProPanelProps {
  readonly instance: Instance;
}

const UbuntuProPanel: FC<UbuntuProPanelProps> = ({ instance }) => {
  return instance.ubuntu_pro_info?.result === "success" ? (
    <>
      <UbuntuProHeader instance={instance} />
      <UbuntuProInfoRow instance={instance} />
      <UbuntuProList services={instance.ubuntu_pro_info.services} />
    </>
  ) : (
    <UbuntuProEmptyState instance={instance} />
  );
};

export default UbuntuProPanel;
