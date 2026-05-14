import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows 'exist' text when no childInstanceId", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(screen.getByText("exist")).toBeInTheDocument();
  });

  it("renders 'Back to Instances page' button", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(screen.getByText("Back to Instances page")).toBeInTheDocument();
  });

  it("renders 'Home page' button", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("navigates to instances page when 'Back to Instances page' is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    await user.click(screen.getByText("Back to Instances page"));
  });

  it("navigates to home page when 'Home page' is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    await user.click(screen.getByText("Home page"));
  });
});
