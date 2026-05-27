import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { Link } from "react-router";
import { ROUTES } from "@/libs/routes";

interface SingleInstanceEmptyStateProps {
  readonly childInstanceId: string | undefined;
  readonly instanceId: string | undefined;
}

const SingleInstanceEmptyState: FC<SingleInstanceEmptyStateProps> = ({
  childInstanceId,
  instanceId,
}) => {
  return (
    <EmptyState
      title="Instance not found"
      icon="connected"
      body={
        <>
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
          .
        </>
      }
      cta={[
        <Link
          to={ROUTES.instances.root()}
          replace
          className="p-button--positive"
          key="go-back-to-instances-page"
        >
          Back to Instances page
        </Link>,
        <Link
          to={ROUTES.root.root()}
          replace
          className="p-button u-no-margin--bottom"
          key="go-back-to-home-page"
        >
          Home page
        </Link>,
      ]}
    />
  );
};

export default SingleInstanceEmptyState;
