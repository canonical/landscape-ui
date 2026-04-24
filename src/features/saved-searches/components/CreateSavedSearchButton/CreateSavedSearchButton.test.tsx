import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CreateSavedSearchButton from "./CreateSavedSearchButton";

describe("CreateSavedSearchButton", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof CreateSavedSearchButton> = {};

  afterEach(() => {
    setEndpointStatus("default");
  });

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

  it("should render with icon when onBackButtonPress is provided", () => {
    const onBackButtonPress = vi.fn();
    renderWithProviders(
      <CreateSavedSearchButton
        {...defaultProps}
        onBackButtonPress={onBackButtonPress}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Add saved search",
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("has-icon");
  });

  it("should open side panel with form when onBackButtonPress is provided and button is clicked", async () => {
    const onBackButtonPress = vi.fn();
    renderWithProviders(
      <CreateSavedSearchButton
        {...defaultProps}
        onBackButtonPress={onBackButtonPress}
      />,
    );

    const button = screen.getByRole("button", { name: "Add saved search" });
    await user.click(button);

    expect(
      await screen.findByRole("heading", { name: "Add saved search" }),
    ).toBeInTheDocument();
  });

  it("should call afterCreate callback after successful form submission", async () => {
    const afterCreate = vi.fn();
    renderWithProviders(
      <CreateSavedSearchButton
        {...defaultProps}
        afterCreate={afterCreate}
        search="alert:package-upgrades"
      />,
    );

    const button = screen.getByRole("button", { name: "Add saved search" });
    await user.click(button);

    await screen.findByRole("heading", { name: "Add saved search" });
    const titleInput = await screen.findByRole("textbox", { name: /title/i });
    await user.type(titleInput, "My Saved Search");

    const submitButtons = screen.getAllByRole("button", {
      name: "Add saved search",
    });
    const submitButton = submitButtons.find(
      (btn) => btn.getAttribute("type") === "submit",
    );
    assert(submitButton);
    await user.click(submitButton);

    await waitFor(() => {
      expect(afterCreate).toHaveBeenCalled();
    });
  });

  it("should close side panel on successful submission when afterCreate is not provided", async () => {
    renderWithProviders(
      <CreateSavedSearchButton
        {...defaultProps}
        search="alert:package-upgrades"
      />,
    );

    const button = screen.getByRole("button", { name: "Add saved search" });
    await user.click(button);

    await screen.findByRole("heading", { name: "Add saved search" });
    const titleInput = await screen.findByRole("textbox", { name: /title/i });
    await user.type(titleInput, "My Saved Search");

    const submitButtons = screen.getAllByRole("button", {
      name: "Add saved search",
    });
    const submitButton = submitButtons.find(
      (btn) => btn.getAttribute("type") === "submit",
    );
    assert(submitButton);
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Add saved search" }),
      ).not.toBeInTheDocument();
    });
  });

  it("should handle API error silently when createSavedSearch fails", async () => {
    setEndpointStatus({ status: "error", path: "CreateSavedSearch" });

    renderWithProviders(
      <CreateSavedSearchButton
        {...defaultProps}
        search="alert:package-upgrades"
      />,
    );

    const button = screen.getByRole("button", { name: "Add saved search" });
    await user.click(button);

    await screen.findByRole("heading", { name: "Add saved search" });
    const titleInput = await screen.findByRole("textbox", { name: /title/i });
    await user.type(titleInput, "My Saved Search");

    const submitButtons = screen.getAllByRole("button", {
      name: "Add saved search",
    });
    const submitButton = submitButtons.find(
      (btn) => btn.getAttribute("type") === "submit",
    );
    assert(submitButton);
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add saved search" }),
      ).toBeInTheDocument();
    });
  });
});
