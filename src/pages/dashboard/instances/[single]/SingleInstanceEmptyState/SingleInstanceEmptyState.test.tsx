import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import SingleInstanceEmptyState from "./SingleInstanceEmptyState";

describe("SingleInstanceEmptyState", () => {
  it("renders 'Instance not found' title", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(screen.getByText("Instance not found")).toBeInTheDocument();
  });

  it("shows instanceId in message", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows childInstanceId in message when provided", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId="99" />,
    );

    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("renders 'Back to Instances page' button", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(screen.getByText("Back to Instances page")).toBeInTheDocument();
  });
});
