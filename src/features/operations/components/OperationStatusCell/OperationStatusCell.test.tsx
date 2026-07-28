import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OperationStatusCell from "./OperationStatusCell";
import { succeededOperation } from "@/tests/mocks/operations";
import { OperationProvider } from "../../context/operationStatus";
import { waitFor } from "@testing-library/react";

const debugMock = vi.fn();

vi.mock("@/hooks/useDebug", () => ({
  default: () => debugMock,
}));

describe("OperationStatusCell", () => {
  beforeEach(() => {
    debugMock.mockClear();
  });

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

  it("calls debug when some operations are unreachable", async () => {
    renderWithProviders(
      <OperationProvider
        operationNames={[succeededOperation.name, "operations/non-existent"]}
      >
        <OperationStatusCell
          operationName={succeededOperation.name}
          type={"publication"}
        />
      </OperationProvider>,
    );

    expect(await screen.findByText("Published")).toBeInTheDocument();

    await waitFor(() => {
      expect(debugMock).toHaveBeenCalledTimes(1);
    });

    const [error] = debugMock.mock.calls[0] ?? [];
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain("operation(s)");
  });
});
