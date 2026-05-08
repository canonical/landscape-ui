import type { APTSource } from "../../types";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileSourceForm from "./RepositoryProfileSourceForm";

const user = userEvent.setup();

const defaultProps = {
  onSuccess: vi.fn(),
  onBack: vi.fn(),
};

describe("RepositoryProfileSourceForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders source name, deb line, and GPG key fields", () => {
    renderWithProviders(<RepositoryProfileSourceForm {...defaultProps} />);

    expect(screen.getByLabelText(/source name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deb line/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gpg key/i)).toBeInTheDocument();
  });

  it("shows required validation errors when submitting empty form", async () => {
    renderWithProviders(<RepositoryProfileSourceForm {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(await screen.findAllByText("This field is required.")).toHaveLength(
      2,
    );
  });

  it("calls onSuccess with correct APTSource on valid submit (no GPG key)", async () => {
    renderWithProviders(<RepositoryProfileSourceForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/source name/i), "my-source");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://example.com/ubuntu focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    const expected: APTSource = {
      id: 0,
      access_group: "",
      profiles: [],
      name: "my-source",
      line: "deb http://example.com/ubuntu focal main",
      gpg_key: null,
    };

    expect(defaultProps.onSuccess).toHaveBeenCalledOnce();
    expect(defaultProps.onSuccess).toHaveBeenCalledWith(expected);
  });

  it("includes gpg_key in APTSource when GPG key is provided", async () => {
    renderWithProviders(<RepositoryProfileSourceForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/source name/i), "my-source");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://example.com/ubuntu focal main",
    );
    await user.type(screen.getByLabelText(/gpg key/i), "sign-key");
    await user.click(screen.getByRole("button", { name: /add source/i }));

    const expected: APTSource = {
      id: 0,
      access_group: "",
      profiles: [],
      name: "my-source",
      line: "deb http://example.com/ubuntu focal main",
      gpg_key: {
        id: 0,
        name: "sign-key",
        key_id: "",
        fingerprint: "",
        has_secret: false,
      },
    };

    expect(defaultProps.onSuccess).toHaveBeenCalledWith(expected);
  });

  it("does not call any mutation hook on submit", async () => {
    renderWithProviders(<RepositoryProfileSourceForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/source name/i), "my-source");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://example.com/ubuntu focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(defaultProps.onSuccess).toHaveBeenCalledOnce();
  });

  it("calls onBack when cancel button is clicked", async () => {
    renderWithProviders(<RepositoryProfileSourceForm {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(defaultProps.onBack).toHaveBeenCalledOnce();
  });

  it("shows name validation error for invalid characters", async () => {
    renderWithProviders(<RepositoryProfileSourceForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/source name/i), "INVALID NAME");
    await user.tab();

    expect(
      await screen.findByText(/name must start with alphanumeric/i),
    ).toBeInTheDocument();
  });

  it("pre-populates fields from initialValues", () => {
    const initialValues = {
      name: "existing-source",
      deb_line: "deb http://archive.ubuntu.com/ubuntu focal main",
      gpg_key_name: "my-gpg-key",
    };
    renderWithProviders(
      <RepositoryProfileSourceForm
        {...defaultProps}
        initialValues={initialValues}
      />,
    );

    expect(screen.getByLabelText(/source name/i)).toHaveValue(
      "existing-source",
    );
    expect(screen.getByLabelText(/deb line/i)).toHaveValue(
      "deb http://archive.ubuntu.com/ubuntu focal main",
    );
    expect(screen.getByLabelText(/gpg key/i)).toHaveValue("my-gpg-key");
  });

  it("shows Save changes button text when initialValues provided", () => {
    renderWithProviders(
      <RepositoryProfileSourceForm
        {...defaultProps}
        initialValues={{
          name: "s",
          deb_line: "deb http://x.com focal main",
          gpg_key_name: "",
        }}
      />,
    );

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });
});
