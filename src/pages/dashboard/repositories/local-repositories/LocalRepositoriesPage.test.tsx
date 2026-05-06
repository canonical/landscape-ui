import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LocalRepositoriesPage from "./LocalRepositoriesPage";
import userEvent from "@testing-library/user-event";

describe("LocalRepositoriesPage", () => {
  it("renders the title and add button", async () => {
    renderWithProviders(<LocalRepositoriesPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: /local repositories/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", { name: /add local repository/i }),
    ).toBeInTheDocument();
  });

  it("renders the add form side panel when add button is clicked", async () => {
    renderWithProviders(<LocalRepositoriesPage />);

    await expectLoadingState();
    await userEvent.click(
      screen.getByRole("button", { name: "Add local repository" }),
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /add repository/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the edit form side panel when sidePath=edit is in the URL", async () => {
    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=edit&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /save changes/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the view form side panel when sidePath=view is in the URL", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=view&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /remove/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the import packages form side panel when sidePath=import-packages is in the URL", async () => {
    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=import-packages&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /import packages/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the publish form side panel when sidePath=publish is in the URL", async () => {
    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=publish&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /publish repository/i,
      }),
    ).toBeInTheDocument();
  });
});
