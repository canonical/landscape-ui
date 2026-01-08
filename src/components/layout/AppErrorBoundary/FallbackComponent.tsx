import EmptyState from "@/components/layout/EmptyState";
import { IS_DEV_ENV } from "@/constants";
import { Button } from "@canonical/react-components";
import type { FallbackRender } from "@sentry/react";

export const FallbackComponent: FallbackRender = (errorData) => {
  const { error, resetError, componentStack } = errorData;

  if (IS_DEV_ENV) {
    console.error(error);
  }

  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <EmptyState
      body={
        <>
          <p className="u-no-margin--bottom">
            Please try again or contact our support team.
          </p>
          {IS_DEV_ENV && (
            <pre
              style={{
                backgroundColor: "#f4f4f4",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                marginTop: "1rem",
                maxHeight: "200px",
                overflow: "auto",
                padding: "1rem",
              }}
            >
              <strong>Error:</strong> {errorMessage}
              <br />
              <strong>Stack trace:</strong>
              <br />
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
