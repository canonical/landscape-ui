import { aptSources } from "@/tests/mocks/apt-sources";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileSourceFormOverlay from "./RepositoryProfileSourceFormOverlay";

const defaultProps = {
  onClose: vi.fn(),
  onSourceAdded: vi.fn(),
};

describe("RepositoryProfileSourceFormOverlay", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty source name, deb line, and GPG key fields when no sourceToEdit", () => {
    renderWithProviders(
      <RepositoryProfileSourceFormOverlay {...defaultProps} />,
    );

    expect(screen.getByLabelText(/source name/i)).toHaveValue("");
    expect(screen.getByLabelText(/deb line/i)).toHaveValue("");
    expect(screen.getByLabelText(/gpg key/i)).toHaveValue("");
  });

  it("pre-populates fields from sourceToEdit when provided", () => {
    const [sourceToEdit] = aptSources;
    renderWithProviders(
      <RepositoryProfileSourceFormOverlay
        {...defaultProps}
        sourceToEdit={sourceToEdit}
      />,
    );

    expect(screen.getByLabelText(/source name/i)).toHaveValue(
      sourceToEdit.name,
    );
    expect(screen.getByLabelText(/deb line/i)).toHaveValue(sourceToEdit.line);
    expect(screen.getByLabelText(/gpg key/i)).toHaveValue(
      sourceToEdit.gpg_key?.name ?? "",
    );
  });

  it("calls onClose when cancel is clicked", async () => {
    renderWithProviders(
      <RepositoryProfileSourceFormOverlay {...defaultProps} />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  it("calls onSourceAdded with correct values on valid submit", async () => {
    renderWithProviders(
      <RepositoryProfileSourceFormOverlay {...defaultProps} />,
    );

    await user.type(screen.getByLabelText(/source name/i), "my-source");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://archive.ubuntu.com/ubuntu focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(defaultProps.onSourceAdded).toHaveBeenCalledOnce();
    expect(defaultProps.onSourceAdded).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "my-source",
        line: "deb http://archive.ubuntu.com/ubuntu focal main",
      }),
    );
  });
});
