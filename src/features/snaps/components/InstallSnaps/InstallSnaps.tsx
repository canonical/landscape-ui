import type { UrlParams } from "@/types/UrlParams";
import type { FC } from "react";
import { useParams } from "react-router";
import SnapsActionForm from "../SnapsActionForm";

const InstallSnaps: FC = () => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();

  return (
    <SnapsActionForm
      selectedInstances={[Number(urlInstanceId)]}
      action="install"
    />
  );
};

export default InstallSnaps;
