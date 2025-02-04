import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import type { FallbackRender } from "@sentry/react";

const FallbackComponent: FallbackRender = (errorData) => {
  const { resetError } = errorData;

  return (
    <EmptyState
      body={
        <>
          <p className="u-no-margin--bottom">
            Please try again or contact our support team.
          </p>
        </>
      }
      cta={[
        <Button
          appearance="positive"
          key="try-again-button"
          onClick={resetError}
          type="button"
        >
          Try again
        </Button>,
      ]}
      icon="disconnect"
      title="Unexpected error occured"
    />
  );
};

export default FallbackComponent;
