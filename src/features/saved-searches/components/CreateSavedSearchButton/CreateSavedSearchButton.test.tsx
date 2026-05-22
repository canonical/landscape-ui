import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import LocationDisplay from "@/tests/LocationDisplay";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it } from "vitest";
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

  it("should update URL with sidePath when clicked", async () => {
    renderWithProviders(
      <>
        <CreateSavedSearchButton {...defaultProps} />
        <LocationDisplay />
      </>
    );

    const button = screen.getByRole("button", {
      name: "Add saved search",
    });

    await user.click(button);

    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=create-saved-search");
  });

  it("should render with icon when isInSidePanel is provided", () => {
    renderWithProviders(
      <CreateSavedSearchButton
        {...defaultProps}
        isInSidePanel={true}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Add saved search",
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("has-icon");
  });

  it("should update URL with search param when clicked", async () => {
    renderWithProviders(
      <>
        <CreateSavedSearchButton
          {...defaultProps}
          search="alert:package-upgrades"
        />
        <LocationDisplay />
      </>
    );

    const button = screen.getByRole("button", { name: "Add saved search" });
    await user.click(button);

    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=create-saved-search");
    expect(screen.getByTestId("location")).toHaveTextContent("query=alert%3Apackage-upgrades");
  });
});
