import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationTargetsPage from "./PublicationTargetsPage";

describe("PublicationTargetsPage", () => {
  it("renders the page title", () => {
    renderWithProviders(<PublicationTargetsPage />);

    expect(
      screen.getByRole("heading", { name: /publication targets/i }),
    ).toBeInTheDocument();
  });

  it("renders the Add publication target button", async () => {
    renderWithProviders(<PublicationTargetsPage />);

    expect(
      await screen.findByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("renders the add form side panel when sidePath=add is in the URL", async () => {
    renderWithProviders(
      <PublicationTargetsPage />,
      undefined,
      "/?sidePath=add",
    );

    await expectLoadingState();

    expect(
      within(screen.getByLabelText("Side panel")).getByRole("button", {
        name: /add publication target/i,
      }),
    ).toBeInTheDocument();
  });
});
