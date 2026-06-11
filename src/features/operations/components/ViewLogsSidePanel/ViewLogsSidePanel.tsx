import SidePanel from "@/components/layout/SidePanel";
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
import { useGetMirror } from "@/features/mirrors";

const COPIED_FEEDBACK_TIMEOUT = 2000;

const ViewLogsSidePanel: FC = () => {
  const { name } = usePageParams();
  const mirror = useGetMirror(name).data.data;
  const { operation, isGettingOperation } = useGetOperation(mirror.lastOperation ?? "", 
    { enabled: !!mirror.lastOperation }
  );
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

  const title = <SidePanel.Header>Update logs for {mirror.displayName}</SidePanel.Header>;

  if (!mirror.lastOperation) {
    return (
      <>
        {title}
        <SidePanel.Content>
          <Notification
            severity="negative"
            title="The selected mirror hasn't had any update attempts yet."
          />
        </SidePanel.Content>
      </>
    );
  }

  if (isGettingOperation) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      {title}
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
          <Notification
            severity="negative"
            title="The last update attempt for the selected mirror had no logs."
          />
        )}
      </SidePanel.Content>
    </>
  );
};

export default ViewLogsSidePanel;
