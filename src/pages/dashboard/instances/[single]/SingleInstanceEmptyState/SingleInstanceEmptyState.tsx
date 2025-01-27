import { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import { useNavigate } from "react-router";

interface SingleInstanceEmptyStateProps {
  childInstanceId: string | undefined;
  instanceId: string | undefined;
}

const SingleInstanceEmptyState: FC<SingleInstanceEmptyStateProps> = ({
  childInstanceId,
  instanceId,
}) => {
  const navigate = useNavigate();

  return (
    <EmptyState
      title="Instance not found"
      icon="connected"
      body={
        <p className="u-no-margin--bottom">
          <span>Seems like the instance with id = </span>
          <code>{instanceId}</code>
          <span> doesn&apos;t </span>
          {childInstanceId ? (
            <>
              <span>have a child instance with id = </span>
              <code>{childInstanceId}</code>
            </>
          ) : (
            <span>exist</span>
          )}
        </p>
      }
      cta={[
        <Button
          appearance="positive"
          key="go-back-to-instances-page"
          onClick={() => navigate(`${ROOT_PATH}instances`, { replace: true })}
          type="button"
          aria-label="Go back"
        >
          Back to Instances page
        </Button>,
        <Button
          key="go-back-to-home-page"
          onClick={() => navigate(`${ROOT_PATH}`, { replace: true })}
          type="button"
          aria-label="Go back"
        >
          Home page
        </Button>,
      ]}
    />
  );
};

export default SingleInstanceEmptyState;
