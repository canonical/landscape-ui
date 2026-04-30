import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import ViewLocalRepositorySidePanel from "./ViewLocalRepositorySidePanel";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";

describe("ViewLocalRepositorySidePanel", () => {
  const user = userEvent.setup();
  it("renders loading state when fetching repository", () => {
    renderWithProviders(
      <ViewLocalRepositorySidePanel />,
      undefined,
      "?sidePath=view&name=aaaa-bbbb-cccc",
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders header and both tabs", async () => {
    renderWithProviders(
      <ViewLocalRepositorySidePanel />,
      undefined,
      "?sidePath=view&name=aaaa-bbbb-cccc",
    );

    await expectLoadingState();

    expect(screen.getByRole("heading", { name: "repo 1" })).toBeInTheDocument();
    expect(screen.getByText(/general details/i)).toBeInTheDocument();
    expect(screen.getByText(/packages/i)).toBeInTheDocument();
  });

  it("renders action buttons in both tabs", async () => {
    renderWithProviders(
      <ViewLocalRepositorySidePanel />,
      undefined,
      "?sidePath=view&name=aaaa-bbbb-cccc",
    );

    await expectLoadingState();

    expect(
      screen.getByRole("button", { name: /actions/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByText(/packages/i));

    expect(
      screen.getByRole("button", { name: /actions/i }),
    ).toBeInTheDocument();
  });

  it("defaults to details tab and changes to packages tab when clicked", async () => {
    renderWithProviders(
      <ViewLocalRepositorySidePanel />,
      undefined,
      "?sidePath=view&name=aaaa-bbbb-cccc",
    );

    await expectLoadingState();

    expect(screen.getByText(/general details/i)).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.click(screen.getByText(/packages/i));

    expect(screen.getByText(/packages/i)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText(/general details/i)).not.toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
