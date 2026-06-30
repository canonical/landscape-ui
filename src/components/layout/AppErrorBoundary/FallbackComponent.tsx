import EmptyState from "@/components/layout/EmptyState";
import { IS_DEV_ENV } from "@/constants";
import { Button } from "@canonical/react-components";
import type { FallbackRender } from "@sentry/react";
import classes from "./FallbackComponent.module.scss";

export const FallbackComponent: FallbackRender = (errorData) => {
  const { error, resetError, componentStack } = errorData;

  if (IS_DEV_ENV) {
    console.error(error);
  }

  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <EmptyState
      className={classes.emptyState}
      body={
        <>
          <p className="u-no-margin--bottom">
            Please try again or contact our support team.
          </p>
          {IS_DEV_ENV && (
            <pre className={classes.errorDetails}>
              <strong>Error:</strong> {errorMessage}
              <br />
              <br />
              <strong>Stack trace:</strong>
              {componentStack}
            </pre>
          )}
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
      title="Unexpected error occurred"
    />
  );
};
