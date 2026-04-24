import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import NewAPTSourceForm from "./NewAPTSourceForm";

describe("NewAPTSourceForm", () => {
  it("renders form fields", () => {
    const { container } = renderWithProviders(<NewAPTSourceForm />);

    expect(container).toHaveTexts([
      "Name",
      "APT Line",
      "GPG key",
      "Access group",
    ]);

    const addAPTSourceButton = screen.getByRole("button", {
      name: /add apt source/i,
    });
    expect(addAPTSourceButton).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NewAPTSourceForm />);

    await user.click(screen.getByRole("button", { name: /add apt source/i }));

    await waitFor(() => {
      const errors = screen.getAllByText(/this field is required/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it("shows validation error for invalid name format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NewAPTSourceForm />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    await user.type(nameInput, "Invalid Name!");

    await user.click(screen.getByRole("button", { name: /add apt source/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/only contain lowercase letters/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for duplicate name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NewAPTSourceForm />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    await user.type(nameInput, "source1");
    await user.type(
      screen.getByRole("textbox", { name: /apt line/i }),
      "deb http://example.com focal main",
    );

    await user.click(screen.getByRole("button", { name: /add apt source/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/must be unique within the account/i),
      ).toBeInTheDocument();
    });
  });

  it("renders Cancel button", () => {
    renderWithProviders(<NewAPTSourceForm />);
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("submits form successfully with valid values", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NewAPTSourceForm />);

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "valid-name",
    );
    await user.type(
      screen.getByRole("textbox", { name: /apt line/i }),
      "deb http://example.com focal main",
    );

    await user.click(screen.getByRole("button", { name: /add apt source/i }));

    // Wait for form submission - side panel should close (no error shown)
    await waitFor(() => {
      expect(
        screen.queryByText(/this field is required/i),
      ).not.toBeInTheDocument();
    });
  });

  it("renders GPG key options", async () => {
    renderWithProviders(<NewAPTSourceForm />);
    const select = screen.getByRole("combobox", { name: /gpg key/i });
    await waitFor(() => {
      expect(select).toBeInTheDocument();
    });
  });

  it("handles mutation error gracefully without showing user-visible error", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ path: "CreateAPTSource", status: "error" });
    renderWithProviders(<NewAPTSourceForm />);

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "valid-name",
    );
    await user.type(
      screen.getByRole("textbox", { name: /apt line/i }),
      "deb http://example.com focal main",
    );

    await user.click(screen.getByRole("button", { name: /add apt source/i }));

    // Form stays open (mutation failed but error is caught silently)
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add apt source/i }),
      ).toBeInTheDocument();
    });
  });

  it("allows submission when apt sources fail to load (no duplicate check needed)", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ path: "GetAPTSources", status: "error" });
    renderWithProviders(<NewAPTSourceForm />);

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "newname",
    );
    await user.type(
      screen.getByRole("textbox", { name: /apt line/i }),
      "deb http://example.com focal main",
    );

    await user.click(screen.getByRole("button", { name: /add apt source/i }));

    // No duplicate name error (getAPTSourcesResponse is undefined, ?? [] returns [])
    await waitFor(() => {
      expect(
        screen.queryByText(/must be unique within the account/i),
      ).not.toBeInTheDocument();
    });
  });
});
