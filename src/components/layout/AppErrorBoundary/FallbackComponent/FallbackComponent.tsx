import EmptyState from "@/components/layout/EmptyState";
import { IS_DEV_ENV } from "@/constants";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary/dist/declarations/src/types";

const FallbackComponent: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  if (IS_DEV_ENV) {
    console.error(error);
  }

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
          onClick={resetErrorBoundary}
          type="button"
        >
          Try again
        </Button>,
      ]}
      icon="disconnect"
      title="Unexpected error occurred"
    />
  );
};

export default FallbackComponent;
