import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AutoinstallFileEditForm from "./AutoinstallFileEditForm";

describe("AutoinstallFileEditForm", () => {
  const [autoinstallFile] = autoinstallFiles;

  it("shows loading state while fetching", async () => {
    renderWithProviders(
      <AutoinstallFileEditForm autoinstallFile={autoinstallFile} />,
    );
    await expectLoadingState();
  });

  it("shows the form with save changes button after loading", async () => {
    renderWithProviders(
      <AutoinstallFileEditForm autoinstallFile={autoinstallFile} />,
    );
    expect(
      await screen.findByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("shows the filename in the form description", async () => {
    renderWithProviders(
      <AutoinstallFileEditForm autoinstallFile={autoinstallFile} />,
    );
    await screen.findByRole("button", { name: /save changes/i });
    expect(
      screen.getByText(new RegExp(autoinstallFile.filename)),
    ).toBeInTheDocument();
  });

  it("shows caution notification when edit history limit is reached", async () => {
    setEndpointStatus({
      status: "variant",
      path: "autoinstall",
      response: {
        current_version: 3,
        max_versions: 3,
        versions: [],
      },
    });
    renderWithProviders(
      <AutoinstallFileEditForm autoinstallFile={autoinstallFile} />,
    );
    expect(
      await screen.findByText(/edit history limit reached/i),
    ).toBeInTheDocument();
  });

  it("does not show caution notification when below edit history limit", async () => {
    renderWithProviders(
      <AutoinstallFileEditForm autoinstallFile={autoinstallFile} />,
    );
    await screen.findByRole("button", { name: /save changes/i });
    expect(
      screen.queryByText(/edit history limit reached/i),
    ).not.toBeInTheDocument();
  });

  it("submits the form when save changes is clicked with changed content", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AutoinstallFileEditForm autoinstallFile={autoinstallFile} />,
    );
    await screen.findByRole("button", { name: /save changes/i });

    // Change content so the submit button is enabled
    const editor = screen.getByTestId("mock-monaco");
    await user.clear(editor);
    await user.type(editor, "changed-content");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(/this field is required/i),
      ).not.toBeInTheDocument();
    });
  });
});
