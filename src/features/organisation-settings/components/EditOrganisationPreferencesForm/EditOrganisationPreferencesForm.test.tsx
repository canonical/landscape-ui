import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditOrganisationPreferencesForm from "./EditOrganisationPreferencesForm";
import { REGISTRATION_KEY_REGEX } from "./constants";

const props = {
  organisationPreferences: {
    title: "Test Organisation",
    registration_password: "",
    auto_register_new_computers: false,
  },
};

describe("EditOrganisationPreferencesForm", () => {
  it("renders correct form fields", () => {
    const { container } = renderWithProviders(
      <EditOrganisationPreferencesForm {...props} />,
    );

    expect(container).toHaveTexts([
      "Organisation's name",
      "Use registration key",
    ]);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it("enables save button when form values change", async () => {
    renderWithProviders(<EditOrganisationPreferencesForm {...props} />);

    const organisationNameInput = screen.getByRole("textbox");
    await userEvent.type(organisationNameInput, " Updated");

    const saveButton = screen.getByRole("button", { name: /save changes/i });
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
      "Organisation's name",
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
});
