import type { FC } from "react";
import { Button } from "@canonical/react-components";
import { useNavigate } from "react-router";
import { EmptyState } from "@landscape/ui";

interface SingleInstanceEmptyStateProps {
  readonly instanceId: string | undefined;
}

const SingleInstanceEmptyState: FC<SingleInstanceEmptyStateProps> = ({
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
          <span>exist</span>.
        </p>
      }
      cta={[
        <Button
          appearance="positive"
          key="go-back-to-instances-page"
          onClick={async () => navigate("/instances", { replace: true })}
          type="button"
          aria-label="Go back"
        >
          Back to Instances page
        </Button>,
        <Button
          key="go-back-to-home-page"
          onClick={async () => navigate("/", { replace: true })}
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
