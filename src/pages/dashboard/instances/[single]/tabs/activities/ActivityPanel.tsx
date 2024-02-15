import { FC } from "react";
import { useParams } from "react-router-dom";
import Activities from "../../../../../../components/activities";

const ActivityPanel: FC = () => {
  const { hostname, childHostname } = useParams();

  return (
    <>
      <Activities
        query={
          hostname
            ? `computer:hostname:${childHostname ?? hostname}`
            : undefined
        }
      />
    </>
  );
};

export default ActivityPanel;
