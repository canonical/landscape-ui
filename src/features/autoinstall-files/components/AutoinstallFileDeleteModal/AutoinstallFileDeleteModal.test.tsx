import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import AutoinstallFileDeleteModal from "./AutoinstallFileDeleteModal";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";

const [autoinstallFile] = autoinstallFiles;
const close = vi.fn();

describe("AutoinstallFileDeleteModal", () => {
  const user = userEvent.setup();

  it("renders modal with correct title", () => {
    renderWithProviders(
      <AutoinstallFileDeleteModal
        autoinstallFile={autoinstallFile}
        close={close}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: new RegExp(autoinstallFile.filename, "i"),
      }),
    ).toBeInTheDocument();
  });

  it("renders filename in modal body", () => {
    renderWithProviders(
      <AutoinstallFileDeleteModal
        autoinstallFile={autoinstallFile}
        close={close}
      />,
    );

    const matches = screen.getAllByText(new RegExp(autoinstallFile.filename));
    expect(matches.length).toBeGreaterThan(0);
  });

  it("calls delete mutation and close when confirmed", async () => {
    renderWithProviders(
      <AutoinstallFileDeleteModal
        autoinstallFile={autoinstallFile}
        close={close}
      />,
    );

    await user.click(screen.getByRole("button", { name: /remove/i }));

    expect(close).toHaveBeenCalled();
  });
});
