import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import EditOrganisationPreferencesForm from "./EditOrganisationPreferencesForm";
import { REGISTRATION_KEY_REGEX } from "./constants";
import useAuth from "@/hooks/useAuth";
import { authUser } from "@/tests/mocks/auth";

vi.mock("@/hooks/useAuth");

const props: ComponentProps<typeof EditOrganisationPreferencesForm> = {
  organisationPreferences: {
    title: "Test Organisation",
    registration_password: "",
    auto_register_new_computers: false,
    audit_retention_period: -1,
  },
};

describe("EditOrganisationPreferencesForm", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      logout: vi.fn(),
      authorized: true,
      authLoading: false,
      setUser: vi.fn(),
      user: authUser,
      redirectToExternalUrl: vi.fn(),
      safeRedirect: vi.fn(),
      isFeatureEnabled: vi.fn(),
      hasAccounts: true,
    });
  });

  it("renders correct form fields", () => {
    const { container } = renderWithProviders(
      <EditOrganisationPreferencesForm {...props} />,
    );

    expect(container).toHaveTexts([
      "Organization's name",
      "Use registration key",
    ]);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute("aria-disabled");
  });

  it("enables save button when form values change", async () => {
    renderWithProviders(<EditOrganisationPreferencesForm {...props} />);

    const organisationNameInput = screen.getByRole("textbox");
    await userEvent.type(organisationNameInput, " Updated");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).not.toHaveAttribute("aria-disabled");
    expect(saveButton).toBeEnabled();
  });

  it("renders registration key fields when 'Use registration key' is checked", async () => {
    const { container } = renderWithProviders(
      <EditOrganisationPreferencesForm {...props} />,
    );

    const useRegistrationKeyCheckbox = screen.getByRole("checkbox", {
      name: /use registration key/i,
    });
    await userEvent.click(useRegistrationKeyCheckbox);

    expect(container).toHaveTexts([
      "Organization's name",
      "Use registration key",
      "Auto register new computers",
    ]);
  });

  describe("Registration key input", () => {
    beforeEach(async () => {
      renderWithProviders(<EditOrganisationPreferencesForm {...props} />);

      const useRegistrationKeyCheckbox = screen.getByRole("checkbox", {
        name: /use registration key/i,
      });
      await userEvent.click(useRegistrationKeyCheckbox);
    });

    it("validates registration key input when length < 3", async () => {
      const registrationKeyInput = screen.getByLabelText("Registration key");
      await userEvent.type(registrationKeyInput, "a1");

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(saveButton);

      const errorText = await screen.findByText(
        /registration key must be at least 3 characters/i,
      );

      expect(errorText).toBeInTheDocument();
    });

    it("validates registration key input when it contains disallowed characters", async () => {
      const registrationKeyInput = screen.getByLabelText("Registration key");
      await userEvent.type(registrationKeyInput, "a21#");

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(saveButton);

      const errorText = await screen.findByText(
        /the key cannot contain trailing spaces or ; or # symbols/i,
      );

      expect(errorText).toBeInTheDocument();
    });
  });

  it("submits a null registration key when the field is empty", async () => {
    renderWithProviders(
      <EditOrganisationPreferencesForm
        organisationPreferences={{
          ...props.organisationPreferences,
          registration_password: "key",
        }}
      />,
    );

    await userEvent.clear(screen.getByLabelText("Registration key"));

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: /use registration key/i,
      }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(
      await screen.findByText("Your changes have been saved"),
    ).toBeInTheDocument();
  });

  it("correctly validates input with regex", () => {
    const invalidRegKeys = [
      ";key",
      "#key",
      "key#",
      "key;",
      "key ",
      "key; ",
      "key #",
      "key;# ",
      "key;#",
      "key#;",
    ];

    for (const key of invalidRegKeys) {
      expect(key).not.toMatch(REGISTRATION_KEY_REGEX);
    }

    const validRegKeys = ["key", "key1", "key1key"];

    for (const key of validRegKeys) {
      expect(key).toMatch(REGISTRATION_KEY_REGEX);
    }
  });

  it("saves changes and updates user when organisation name is changed", async () => {
    const setUser = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      logout: vi.fn(),
      authorized: true,
      authLoading: false,
      setUser,
      user: authUser,
      redirectToExternalUrl: vi.fn(),
      safeRedirect: vi.fn(),
      isFeatureEnabled: vi.fn(),
      hasAccounts: true,
    });

    renderWithProviders(<EditOrganisationPreferencesForm {...props} />);

    const nameInput = screen.getByRole("textbox", {
      name: /organization's name/i,
    });
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "New Organisation Name");

    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(
      await screen.findByText("Your changes have been saved"),
    ).toBeInTheDocument();
    expect(setUser).toHaveBeenCalled();
  });

  it("does not update user when user is null", async () => {
    vi.mocked(useAuth).mockReturnValue({
      logout: vi.fn(),
      authorized: true,
      authLoading: false,
      setUser: vi.fn(),
      user: null,
      redirectToExternalUrl: vi.fn(),
      safeRedirect: vi.fn(),
      isFeatureEnabled: vi.fn(),
      hasAccounts: true,
    });

    renderWithProviders(<EditOrganisationPreferencesForm {...props} />);

    const nameInput = screen.getByRole("textbox", {
      name: /organization's name/i,
    });
    await userEvent.type(nameInput, " Updated");

    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(
      screen.queryByText("Your changes have been saved"),
    ).not.toBeInTheDocument();
  });
});
