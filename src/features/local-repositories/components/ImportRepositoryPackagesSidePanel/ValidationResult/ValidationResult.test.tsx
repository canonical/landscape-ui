import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ValidationResult from "./ValidationResult";
import type {
  PackagesValidationState,
  PackagesValidationOperation,
} from "@/features/operations";
import {
  emptyOperation,
  overCountOperation,
  failedOperation,
  succeededOperation,
  timeoutOperation,
} from "@/tests/mocks/operations";
import { getPackageList } from "../helpers";

const makeTask = (
  operation: PackagesValidationOperation,
): PackagesValidationState => {
  const { response, count } = getPackageList(operation.response?.output ?? "");
  return {
    status: operation.metadata?.status,
    count: count,
    response: response,
    done: operation.done,
    error: operation.error,
  };
};

describe("ValidationResult", () => {
  it("renders timeout warning when error code is 4", () => {
    renderWithProviders(
      <ValidationResult validationTask={makeTask(timeoutOperation)} />,
    );

    expect(screen.getByText("Fetching packages timed out")).toBeInTheDocument();
    expect(
      screen.getByText(/you can still proceed to import packages/i),
    ).toBeInTheDocument();
  });

  it("renders error notification when status is failed not timeout", () => {
    renderWithProviders(
      <ValidationResult validationTask={makeTask(failedOperation)} />,
    );

    expect(screen.getByText("Could not fetch packages")).toBeInTheDocument();
    expect(
      screen.getByText(/the operation failed unexpectedly/i),
    ).toBeInTheDocument();
  });

  it("renders default error notification when failed without error message", () => {
    renderWithProviders(
      <ValidationResult
        validationTask={makeTask({ ...failedOperation, error: undefined })}
      />,
    );

    expect(screen.getByText("Could not fetch packages")).toBeInTheDocument();
    expect(screen.getByText(/an unknown error occurred/i)).toBeInTheDocument();
  });

  it("renders error notification when succeeded with zero count", () => {
    renderWithProviders(
      <ValidationResult validationTask={makeTask(emptyOperation)} />,
    );

    expect(
      screen.getByText("No packages available from the URL provided"),
    ).toBeInTheDocument();
  });

  it("renders warning and paginated list when count exceeds 100", () => {
    renderWithProviders(
      <ValidationResult validationTask={makeTask(overCountOperation)} />,
    );

    expect(
      screen.getByText("Only the first 100 packages of 147 are displayed"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all 147 packages will be imported/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/packages to import/i)).toBeInTheDocument();
    expect(
      screen.getByText("python3-snap-http_1.4.0-0ubuntu0_all"),
    ).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 10/i)).toBeInTheDocument();
  });

  it("renders packages list with proper header when succeeded with packages", () => {
    renderWithProviders(
      <ValidationResult validationTask={makeTask(succeededOperation)} />,
    );

    expect(screen.getByText(/packages to import/i)).toBeInTheDocument();
    expect(
      screen.getByText("python3-snap-http_1.4.0-0ubuntu0_all"),
    ).toBeInTheDocument();
    expect(screen.getByText("package2-1.0.0")).toBeInTheDocument();
  });
});
