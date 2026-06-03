import { FEEDBACK_LINK, IS_DEV_ENV } from "@/constants";
import { Button, CodeSnippet, Icon } from "@canonical/react-components";
import type { FallbackRender } from "@sentry/react";
import { useState } from "react";
import type { FC } from "react";
import classes from "./FallbackComponent.module.scss";

const COPIED_FEEDBACK_TIMEOUT = 2000;

interface ErrorFallbackProps {
  readonly error: unknown;
  readonly componentStack?: string | null;
  readonly resetError: () => void;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  componentStack,
  resetError,
}) => {
  const [copied, setCopied] = useState(false);

  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  const handleReload = () => {
    window.location.reload();
  };

  const handleCopy = async () => {
    const report = [
      `Error: ${errorMessage}`,
      stack ? `\n\nStack trace:\n${stack}` : "",
      componentStack ? `\n\nComponent stack:${componentStack}` : "",
    ]
      .join("")
      .trim();

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, COPIED_FEEDBACK_TIMEOUT);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={classes.wrapper} role="alert" aria-live="assertive">
      <div className={classes.panel}>
        <Icon name="disconnect" className={classes.icon} aria-hidden />

        <p className="p-heading--3 u-no-margin--bottom">Something went wrong</p>

        <p className={classes.subtitle}>
          We hit an unexpected error while loading this page. You can try again
          — if the problem continues, please{" "}
          <a href={FEEDBACK_LINK} rel="noopener noreferrer" target="_blank">
            report it
          </a>{" "}
          or contact our support team.
        </p>

        <div className={classes.actions}>
          <Button appearance="positive" onClick={resetError} type="button">
            Try again
          </Button>
          <Button appearance="base" onClick={handleReload} type="button">
            Reload page
          </Button>
        </div>

        {IS_DEV_ENV && (
          <details className={classes.details}>
            <summary className={classes.summary}>
              <Icon name="chevron-down" className={classes.summaryIcon} />
              <span>Technical details</span>
            </summary>

            <div className={classes.detailsBody}>
              <div className={classes.copyRow}>
                <Button
                  appearance="base"
                  className="u-no-margin--bottom"
                  hasIcon
                  onClick={handleCopy}
                  type="button"
                >
                  <Icon name={copied ? "success" : "copy"} />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>

              <CodeSnippet
                className={classes.snippet}
                blocks={[
                  { title: "Error", code: errorMessage, wrapLines: true },
                  ...(stack
                    ? [{ title: "Stack trace", code: stack, wrapLines: true }]
                    : []),
                  ...(componentStack
                    ? [
                        {
                          title: "Component stack",
                          code: componentStack.trim(),
                          wrapLines: true,
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export const FallbackComponent: FallbackRender = (errorData) => {
  const { error, resetError, componentStack } = errorData;

  if (IS_DEV_ENV) {
    console.error(error);
  }

  return (
    <ErrorFallback
      componentStack={componentStack}
      error={error}
      resetError={resetError}
    />
  );
};
