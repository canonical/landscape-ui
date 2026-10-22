import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useParams } from "react-router";
import SnapsActionForm from "../SnapsActionForm";

const InstallSnaps: FC = () => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();

  return (
    <SnapsActionForm
      selectedInstances={[Number(childInstanceId ?? urlInstanceId)]}
      action="install"
    />
  );
};

export default InstallSnaps;
