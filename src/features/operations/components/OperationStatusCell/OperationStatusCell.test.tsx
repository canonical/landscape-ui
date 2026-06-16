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
import { resetLroProgress } from "@/tests/server/handlers/operations";

describe("OperationStatusCell", () => {
  it("renders loading while fetching", () => {
    renderWithProviders(
      <OperationStatusCell
        operation={undefined}
        isGettingOperation={true}
        type={"mirror"}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders operation status when operation is undefined", () => {
    renderWithProviders(
      <OperationStatusCell operation={undefined} type={"mirror"} />,
    );

    expect(screen.getByText("Not yet updated")).toBeInTheDocument();
  });

  it("renders successful publication operation status", () => {
    renderWithProviders(
      <OperationStatusCell
        operation={succeededOperation}
        type={"publication"}
      />,
    );

    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("renders failed mirror operation status", () => {
    renderWithProviders(
      <OperationStatusCell operation={failedOperation} type={"mirror"} />,
    );

    expect(screen.getByText("Update failed")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view logs/i }),
    ).toBeInTheDocument();
  });

  it("renders in progress mirror operation status", () => {
    resetLroProgress();

    renderWithProviders(
      <OperationStatusCell operation={inProgressOperation} type={"mirror"} />,
    );

    expect(screen.getByText("Updating")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
  });

  it("renders idle local operation status", () => {
    renderWithProviders(
      <OperationStatusCell operation={idleOperation} type={"local"} />,
    );

    expect(screen.getByText("Importing packages")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
