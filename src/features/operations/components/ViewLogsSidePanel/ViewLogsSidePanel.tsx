import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { CodeSnippet } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import { useEffect, useRef, useState, type FC } from "react";
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
  );

  const { error, metadata: { operationId } = {} } = operation ?? {};

  // The API requires the details type to be an array, but in practice it will
  // only ever have at most 1 element.
  const logs =
    error?.details[0]?.stackEntries?.join("\n") || "Task failed with no logs";

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

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  if (resource.lastOperation && isGettingOperation) {
    return <SidePanel.LoadingState />;
  }

  const fileName = resource.displayName.replaceAll(" ", "-");

  const handleDownload = () => {
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}_${operationId}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

  return (
    <>
      <SidePanel.Header>
        {operationType} logs for {resource.displayName}
      </SidePanel.Header>
      <SidePanel.Content>
        {!error ? (
          <EmptyState
            icon="file"
            title="Logs not found"
            body="It seems that the logs you're looking for don't exist."
          />
        ) : (
          <>
            <div className={classes.actionRow}>
              <Button
                type="button"
                importance="tertiary"
                icon={copied ? "success" : "copy"}
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                type="button"
                importance="tertiary"
                icon="download"
                onClick={handleDownload}
              >
                Download
              </Button>
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
