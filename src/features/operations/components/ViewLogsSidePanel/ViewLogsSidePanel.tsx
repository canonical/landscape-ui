import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { Button, CodeSnippet, Icon } from "@canonical/react-components";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { useGetOperation, useGetOperationResource } from "../../api";
import classes from "./ViewLogsSidePanel.module.scss";
import EmptyState from "@/components/layout/EmptyState";

const COPIED_FEEDBACK_TIMEOUT = 2000;

interface ViewLogsSidePanelProps {
  readonly resourceType: "mirrors" | "publications" | "locals";
}

const ViewLogsSidePanel: FC<ViewLogsSidePanelProps> = ({ resourceType }) => {
  const { name } = usePageParams();
  const resourceIdentifier =
    resourceType === "mirrors" ? name : `${resourceType}/${name}`;
  const resource = useGetOperationResource(resourceIdentifier);
  const { operation, isGettingOperation } = useGetOperation(
    resource.lastOperation ?? "",
    { enabled: !!resource.lastOperation },
  );

  const { error: { details } = {}, metadata: { operationId } = {} } =
    operation ?? {};

  const logs = details?.join("\n") ?? "";

  const getOperationType = () => {
    switch (resourceType) {
      case "publications":
        return "Publication";
      case "mirrors":
        return "Update";
      case "locals":
        return "Import";
    }
  };
  const operationType = getOperationType();

  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | undefined>(undefined);

  const url = useMemo(() => {
    const blob = new Blob([logs], { type: "text/plain" });
    return URL.createObjectURL(blob);
  }, [logs]);

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);

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

  if (resource.lastOperation && isGettingOperation) {
    return <SidePanel.LoadingState />;
  }

  const file = `${resource.displayName.replaceAll(" ", "-")}_${operationId}`;

  return (
    <>
      <SidePanel.Header>
        {operationType} logs for {resource.displayName}
      </SidePanel.Header>
      <SidePanel.Content>
        {!logs ? (
          <EmptyState
            icon="file"
            title="Logs not found"
            body="It seems that the logs you're looking for don't exist."
          />
        ) : (
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
                download={`${file}.log`}
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
        )}
      </SidePanel.Content>
    </>
  );
};

export default ViewLogsSidePanel;
