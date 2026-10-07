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
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import userEvent from "@testing-library/user-event";

const TestComponent = ({
  isTableCell = false,
}: {
  readonly isTableCell?: boolean;
}) => {
  return (
    <>
      <OperationStatusContent
        operationMetadata={failedMirrorOperation.metadata}
        type="mirror"
        hasOperation={true}
        isTableCell={isTableCell}
      />
      <LocationDisplay />
    </>
  );
};

describe("OperationStatusContent", () => {
  beforeEach(() => {
    setEndpointStatus("default");
    resetLroProgress();
  });

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
    expect(getLocationDisplay()).toHaveTextContent("sidePath=view%2Clogs");
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
    const location = getLocationDisplay();
    expect(location).toHaveTextContent("sidePath=logs");
    expect(location).toHaveTextContent(
      `name=${encodeURIComponent(failedMirrorOperation.metadata.resource)}`,
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

  it("renders idle local operation status in table cell", async () => {
    renderWithProviders(
      <OperationStatusContent
        operationMetadata={idleOperation.metadata}
        type="local"
        hasOperation={true}
        isTableCell={true}
      />,
    );

    expect(screen.getByText("Importing")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
  });

  it("hides cancel button in table cell if persistent LROs are disabled", () => {
    setEndpointStatus({ status: "empty", path: "debarchive/features" });

    renderWithProviders(
      <OperationStatusContent
        operationMetadata={idleOperation.metadata}
        type="local"
        hasOperation={true}
        isTableCell={true}
      />,
    );

    expect(screen.getByText("Importing")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
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

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  it("cancels operation when cancel button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <OperationStatusContent
        operationMetadata={idleOperation.metadata}
        type="local"
        hasOperation={true}
        isTableCell={true}
      />,
    );

    await user.click(await screen.findByRole("button", { name: /cancel/i }));

    expect(
      screen.getByRole("button", { name: "Canceling..." }),
    ).toBeInTheDocument();

    expect(await screen.findByText("Import failed")).toBeInTheDocument();
  });

  it("shows an error notification when canceling the operation fails", async () => {
    setEndpointStatus({ status: "error", path: "operations/cancel" });
    const user = userEvent.setup();

    renderWithProviders(
      <OperationStatusContent
        operationMetadata={idleOperation.metadata}
        type="local"
        hasOperation={true}
        isTableCell={true}
      />,
    );

    await user.click(await screen.findByRole("button", { name: /cancel/i }));

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
