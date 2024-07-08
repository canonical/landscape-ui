import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneralOrganisationSettings from "./GeneralOrganisationSettings";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";

describe("EditOrganisationPreferencesForm", () => {
  it("renders settings", () => {
    renderWithProviders(<GeneralOrganisationSettings />);
    expect(
      screen.getByRole("heading", { name: /general/i }),
    ).toBeInTheDocument();
  });

  it("renders empty state when failing to load information", async () => {
    setEndpointStatus("error");
    renderWithProviders(<GeneralOrganisationSettings />);

    await expectLoadingState();

    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it("refetches data", async () => {
    setEndpointStatus("error");
    renderWithProviders(<GeneralOrganisationSettings />);

    await expectLoadingState();

    const tryAgainButton = screen.getByRole("button", {
      name: /try again/i,
    });

    setEndpointStatus("default");
    await userEvent.click(tryAgainButton);

    const saveButton = await screen.findByRole("button", {
      name: /save changes/i,
    });
    expect(saveButton).toBeInTheDocument();
  });
});
