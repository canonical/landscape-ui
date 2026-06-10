import SidePanel from "@/components/layout/SidePanel";
import LoadingState from "@/components/layout/SidePanel/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import {
  Button,
  CodeSnippet,
  Icon,
  Notification,
} from "@canonical/react-components";
import { useEffect, useRef, useState, type FC } from "react";
import { useGetOperation } from "../../api";
import classes from "./ViewLogsSidePanel.module.scss";

const COPIED_FEEDBACK_TIMEOUT = 2000;

const ViewLogsSidePanel: FC = () => {
  const { name } = usePageParams();
  const { operation, isGettingOperation } = useGetOperation(name);
  const logs = operation?.error?.details?.join("\n") ?? "";

  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | undefined>(undefined);

  const blob = new Blob([logs], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(logs);
      setCopied(true);
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, COPIED_FEEDBACK_TIMEOUT);
    } catch {
      setCopied(false);
    }
  };

  if (isGettingOperation) {
    return <LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Update logs for mirror</SidePanel.Header>
      <SidePanel.Content>
        {logs ? (
          <>
            <div className={classes.actionRow}>
              <Button
                appearance="base"
                className="u-no-margin"
                hasIcon
                onClick={handleCopy}
                type="button"
              >
                <Icon name={copied ? "success" : "copy"} />
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
              <a
                className="p-button--base has-icon u-no-margin--bottom"
                href={url}
                download={`${name}.log`}
              >
                <Icon name="begin-downloading" />
                <span>Download</span>
              </a>
            </div>
            <CodeSnippet
              blocks={[
                {
                  title: "Output",
                  code: logs,
                  wrapLines: true,
                },
              ]}
              className={classes.code}
            />
          </>
        ) : (
          <Notification borderless severity="negative">
            No logs available.
          </Notification>
        )}
      </SidePanel.Content>
    </>
  );
};

export default ViewLogsSidePanel;
