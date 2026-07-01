import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationsPage from "./PublicationsPage";
import userEvent from "@testing-library/user-event";

describe("PublicationsPage", () => {
  it("renders the title and add button", async () => {
    renderWithProviders(<PublicationsPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: /publications/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", { name: /add publication/i }),
    ).toBeInTheDocument();
  });

  it("renders the add form side panel when add button is clicked", async () => {
    renderWithProviders(<PublicationsPage />);

    await expectLoadingState();
    await userEvent.click(
      await screen.findByRole("button", { name: /add publication/i }),
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /add publication/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the view form side panel when sidePath=view is in the URL", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <PublicationsPage />,
      undefined,
      "/?sidePath=view&name=7b1d5c2f-0c4e-4d8e-8f2f-99d4f2d9a123",
    );

    const sidePanel = await screen.findByLabelText("Side panel");

    expect(
      await within(sidePanel).findByRole(
        "button",
        { name: /republish/i },
        { timeout: 2000 },
      ),
    ).toBeInTheDocument();
  });

  it("renders the logs side panel when sidePath=logs is in the URL", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <PublicationsPage />,
      undefined,
      "/?sidePath=logs&name=g8h8888e-c8f8-8e88-ab8c-ef8a8c8af8c8",
    );

    const sidePanel = await screen.findByLabelText("Side panel");

    expect(
      await within(sidePanel).findByRole("heading", {
        name: /Publication logs for local publication/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(sidePanel).getByRole("button", { name: /copy/i }),
    ).toBeInTheDocument();
  });
});
