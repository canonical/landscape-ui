import { FEEDBACK_LINK, IS_DEV_ENV } from "@/constants";
import { CodeSnippet } from "@canonical/react-components";
import { Button, Icon } from "@canonical/react-ds-global";
import type { FallbackRender } from "@sentry/react";
import { useEffect, useRef, useState } from "react";
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
  const copiedTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  const handleReload = () => {
    window.location.reload();
  };

  const handleCopy = async () => {
    const report = [
      `Error: ${errorMessage}`,
      stack ? `\n\nStack trace:\n${stack}` : "",
      componentStack ? `\n\nComponent stack:\n${componentStack.trim()}` : "",
    ]
      .join("")
      .trim();

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, COPIED_FEEDBACK_TIMEOUT);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={classes.wrapper} role="alert" aria-live="assertive">
      <div className={classes.panel}>
        <Icon icon="disconnected" className={classes.icon} />

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
          <Button importance="primary" onClick={resetError} type="button">
            Try again
          </Button>
          <Button importance="tertiary" onClick={handleReload} type="button">
            Reload page
          </Button>
        </div>

        {IS_DEV_ENV && (
          <details className={classes.details}>
            <summary className={classes.summary}>
              <Icon icon="chevron-down" className={classes.summaryIcon} />
              <span>Technical details</span>
            </summary>

            <div className={classes.detailsBody}>
              <div className={classes.copyRow}>
                <Button
                  importance="tertiary"
                  icon={copied ? "success" : "copy"}
                  onClick={handleCopy}
                  type="button"
                >
                  {copied ? "Copied" : "Copy"}
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
