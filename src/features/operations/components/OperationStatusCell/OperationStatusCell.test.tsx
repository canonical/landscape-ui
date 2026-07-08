import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OperationStatusCell from "./OperationStatusCell";
import { succeededOperation } from "@/tests/mocks/operations";
import { OperationProvider } from "../../context/operationStatus";

describe("OperationStatusCell", () => {
  it("renders operation status when operationName is undefined", () => {
    renderWithProviders(
      <OperationStatusCell operationName={undefined} type={"mirror"} />,
    );

    expect(screen.getByText("Not yet updated")).toBeInTheDocument();
  });

  it("renders publication status", async () => {
    renderWithProviders(
      <OperationProvider operationNames={[succeededOperation.name]}>
        <OperationStatusCell
          operationName={succeededOperation.name}
          type={"publication"}
        />
      </OperationProvider>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(await screen.findByText("Published")).toBeInTheDocument();
  });
});
