import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OperationStatusContent from "./OperationStatusContent";
import {
  failedMirrorOperation,
  idleOperation,
  succeededOperation,
  inProgressOperation,
} from "@/tests/mocks/operations";
import { resetLroProgress } from "@/tests/server/handlers/operations";
import usePageParams from "@/hooks/usePageParams";
import userEvent from "@testing-library/user-event";

const TestComponent = ({
  isTableCell = false,
}: {
  readonly isTableCell?: boolean;
}) => {
  const { sidePath, name } = usePageParams();

  return (
    <>
      <OperationStatusContent
        operationMetadata={failedMirrorOperation.metadata}
        type="mirror"
        hasOperation={true}
        isTableCell={isTableCell}
      />
      <div data-testid="sidePath">{sidePath.join("&")}</div>
      <div data-testid="name">{name}</div>
    </>
  );
};

describe("OperationStatusContent", () => {
  it("renders operation error when resource has operation but operation is undefined", () => {
    renderWithProviders(
      <OperationStatusContent
        operationMetadata={undefined}
        type="mirror"
        hasOperation={true}
      />,
    );

    expect(screen.getByText("Unable to determine")).toBeInTheDocument();
  });

  it("renders operation status when resource has no operation", () => {
    renderWithProviders(
      <OperationStatusContent
        operationMetadata={undefined}
        type="mirror"
        hasOperation={false}
      />,
    );

    expect(screen.getByText("Not yet updated")).toBeInTheDocument();
  });

  it("renders successful publication operation status", () => {
    renderWithProviders(
      <OperationStatusContent
        operationMetadata={succeededOperation.metadata}
        type="publication"
        hasOperation={true}
      />,
    );

    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("renders failed mirror operation status with view logs button", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <TestComponent />,
      undefined,
      `?sidePath=view&name=${failedMirrorOperation.metadata.resource}`,
    );

    expect(screen.getByText("Update failed")).toBeInTheDocument();

    const logsButton = screen.getByRole("button", { name: /view logs/i });
    await user.click(logsButton);
    expect(screen.getByTestId("sidePath")).toHaveTextContent("view&logs");
  });

  it("view logs button from table cell overwrites open sidepanel", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <TestComponent isTableCell={true} />,
      undefined,
      "?sidePath=view&name=test-resource",
    );

    const logsButton = screen.getByRole("button", { name: /view logs/i });
    await user.click(logsButton);
    expect(screen.getByTestId("sidePath")).toHaveTextContent("logs");
    expect(screen.getByTestId("name")).toHaveTextContent(
      failedMirrorOperation.metadata.resource,
    );
  });

  it("renders in progress local operation status", () => {
    resetLroProgress();

    renderWithProviders(
      <OperationStatusContent
        operationMetadata={inProgressOperation.metadata}
        type="local"
        hasOperation={true}
      />,
    );

    expect(screen.getByText("Importing")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
  });

  it("renders idle local operation status in table cell", () => {
    renderWithProviders(
      <OperationStatusContent
        operationMetadata={idleOperation.metadata}
        type="local"
        hasOperation={true}
        isTableCell={true}
      />,
    );

    expect(screen.getByText("Importing packages")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders loading state if operations are being fetched", () => {
    resetLroProgress();

    renderWithProviders(
      <OperationStatusContent
        operationMetadata={inProgressOperation.metadata}
        type="local"
        hasOperation={true}
        isGettingOperations={true}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
