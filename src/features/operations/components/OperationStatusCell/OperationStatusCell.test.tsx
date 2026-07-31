import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OperationStatusCell from "./OperationStatusCell";
import {
  batchGetOperationNamesWithMissing,
  succeededOperation,
} from "@/tests/mocks/operations";
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

  it("renders status when some operations are unreachable", async () => {
    const [, missingOperationName] = batchGetOperationNamesWithMissing;
    if (!missingOperationName) {
      throw new Error("Missing operation name fixture");
    }

    renderWithProviders(
      <OperationProvider
        operationNames={[succeededOperation.name, missingOperationName]}
      >
        <OperationStatusCell
          operationName={succeededOperation.name}
          type={"publication"}
        />
      </OperationProvider>,
    );

    expect(await screen.findByText("Published")).toBeInTheDocument();
  });

  it("still resolves known operations and flags unreachable ones as undetermined", async () => {
    // Guards the mock handler's returnPartialSuccess contract: if the hook ever
    // stops sending the flag, the batch request fails outright and neither
    // status below would render.
    const [knownName, unknownName] = batchGetOperationNamesWithMissing;
    if (!knownName || !unknownName) {
      throw new Error("Missing operation name fixture");
    }

    renderWithProviders(
      <OperationProvider operationNames={[knownName, unknownName]}>
        <OperationStatusCell operationName={knownName} type={"publication"} />
        <OperationStatusCell
          operationName={unknownName}
          type={"publication"}
        />
      </OperationProvider>,
    );

    expect(await screen.findByText("Published")).toBeInTheDocument();
    expect(await screen.findByText("Unable to determine")).toBeInTheDocument();
  });
});
