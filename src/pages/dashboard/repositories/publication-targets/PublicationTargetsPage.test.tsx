import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationTargetsPage from "./PublicationTargetsPage";
import userEvent from "@testing-library/user-event";

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

  it("renders the add form side panel when add button is clicked", async () => {
    renderWithProviders(<PublicationTargetsPage />);

    await expectLoadingState();
    await userEvent.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /add publication target/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the edit form side panel when sidePath=edit is in the URL", async () => {
    renderWithProviders(
      <PublicationTargetsPage />,
      undefined,
      "/?sidePath=edit&name=aaaaaaaa-0000-0000-0000-000000000001",
    );

    await expectLoadingState();

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /save changes/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the view form side panel when sidePath=view is in the URL", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <PublicationTargetsPage />,
      undefined,
      "/?sidePath=view&name=aaaaaaaa-0000-0000-0000-000000000001",
    );

    await expectLoadingState();

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /remove/i,
      }),
    ).toBeInTheDocument();
  });
});
