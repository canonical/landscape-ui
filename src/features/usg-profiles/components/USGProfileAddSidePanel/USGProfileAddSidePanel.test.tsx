import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import USGProfileAddSidePanel from "./USGProfileAddSidePanel";

describe("USGProfileAddSidePanel", () => {
  it("should validate current step and block next when title is empty", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await userEvent.click(await screen.findByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });

  it("should have a back button after the first page", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Title" }),
      "Name",
    );

    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();

    await userEvent.click(await screen.findByRole("button", { name: "Next" }));

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
  });
});
