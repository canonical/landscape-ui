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

  it("shows 'exist' text when no childInstanceId", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(screen.getByText("exist")).toBeInTheDocument();
  });

  it("renders 'Back to Instances page' link", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(
      screen.getByRole("link", { name: "Back to Instances page" }),
    ).toHaveAttribute("href", "/instances");
  });

  it("renders 'Home page' link", () => {
    renderWithProviders(
      <SingleInstanceEmptyState instanceId="42" childInstanceId={undefined} />,
    );

    expect(screen.getByRole("link", { name: "Home page" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
