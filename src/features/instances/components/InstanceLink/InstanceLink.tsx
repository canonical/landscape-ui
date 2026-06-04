import type { FC } from "react";
import { useGetInstance } from "../../api";
import { Spinner } from "@canonical/react-components";
import NoData from "@/components/layout/NoData";
import { Link } from "react-router";
import { ROUTES } from "@/libs/routes/routes";

interface InstanceLinkProps {
  readonly instanceId: number;
}

const InstanceLink: FC<InstanceLinkProps> = ({ instanceId }) => {
  const { instance, isGettingInstance } = useGetInstance({ instanceId });

  if (isGettingInstance) {
    return <Spinner />;
  }

  if (!instance) {
    return <NoData />;
  }

  return (
    <Link to={ROUTES.instances.details.single(instanceId)}>
      {instance.title}
    </Link>
  );
};

export default InstanceLink;
