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

  it("renders failed mirror operation status", () => {
    renderWithProviders(
      <OperationStatusContent
        operationMetadata={failedMirrorOperation.metadata}
        type="mirror"
        hasOperation={true}
      />,
    );

    expect(screen.getByText("Update failed")).toBeInTheDocument();
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
});
