import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OperationStatusCell from "./OperationStatusCell";
import {
  failedOperation,
  idleOperation,
  succeededOperation,
  inProgressOperation,
} from "@/tests/mocks/operations";

describe("OperationStatusCell", () => {
  it("renders loading while fetching", () => {
    renderWithProviders(
      <OperationStatusCell operation={undefined} isGettingOperation={true} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders operation status when operation is undefined", () => {
    renderWithProviders(<OperationStatusCell operation={undefined} />);

    expect(screen.getByText("Not yet updated")).toBeInTheDocument();
  });

  it("renders successful operation status", () => {
    renderWithProviders(<OperationStatusCell operation={succeededOperation} />);

    expect(screen.getByText("Updated")).toBeInTheDocument();
  });

  it("renders failed operation status", () => {
    renderWithProviders(<OperationStatusCell operation={failedOperation} />);

    expect(screen.getByText("Update failed")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view logs/i }),
    ).toBeInTheDocument();
  });

  it("renders in progress operation status", () => {
    renderWithProviders(
      <OperationStatusCell operation={inProgressOperation} />,
    );

    expect(screen.getByText("Updating")).toBeInTheDocument();
    expect(screen.getByText("38%")).toBeInTheDocument();
  });

  it("renders in progress operation status for idle operation", () => {
    renderWithProviders(<OperationStatusCell operation={idleOperation} />);

    expect(screen.getByText("Updating")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
