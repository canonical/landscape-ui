import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import CreateSavedSearchButton from "./CreateSavedSearchButton";

describe("CreateSavedSearchButton", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof CreateSavedSearchButton> = {};

  it("should render button with default label", () => {
    renderWithProviders(<CreateSavedSearchButton {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: "Add saved search",
    });
    expect(button).toBeInTheDocument();
  });

  it("should render button with custom label", () => {
    renderWithProviders(
      <CreateSavedSearchButton {...defaultProps} buttonLabel="Save search" />,
    );

    const button = screen.getByRole("button", { name: "Save search" });
    expect(button).toBeInTheDocument();
  });

  it("should render with custom appearance", () => {
    renderWithProviders(
      <CreateSavedSearchButton {...defaultProps} appearance="positive" />,
    );

    const button = screen.getByRole("button", {
      name: "Add saved search",
    });
    expect(button).toBeInTheDocument();
  });

  it("should open side panel when clicked", async () => {
    renderWithProviders(<CreateSavedSearchButton {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: "Add saved search",
    });

    await user.click(button);

    expect(
      await screen.findByRole("heading", { name: "Add saved search" }),
    ).toBeInTheDocument();
  });
});
