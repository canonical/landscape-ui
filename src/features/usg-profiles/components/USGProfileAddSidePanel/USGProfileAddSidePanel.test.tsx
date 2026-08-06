import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import USGProfileAddSidePanel from "./USGProfileAddSidePanel";

describe("USGProfileAddSidePanel", () => {
  const user = userEvent.setup();

  const goToStep2 = async () => {
    await user.type(screen.getByRole("textbox", { name: "Title" }), "Name");
    await user.click(await screen.findByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
  };

  const goToStep3 = async (mode = "Audit only") => {
    await goToStep2();

    await user.click(screen.getByLabelText("Base profile"));
    await user.click(await screen.findByText("CIS Level 1 Workstation"));
    await user.click(screen.getByLabelText("Mode"));
    await user.click(await screen.findByText(mode));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();
  };

  const goToConfirmationStep = async () => {
    await goToStep3();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 4 of 5")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 5 of 5")).toBeInTheDocument();
  };

  it("should validate current step and block next when title is empty", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await user.click(await screen.findByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });

  it("should have a back button after the first page", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await user.type(screen.getByRole("textbox", { name: "Title" }), "Name");

    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();

    await user.click(await screen.findByRole("button", { name: "Next" }));

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
  });

  it("should block on step 2 when benchmark fields are missing", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await goToStep2();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
    expect(
      screen.queryByText(/configure delivery settings/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByText("This field is required.").length,
    ).toBeGreaterThan(0);

    await user.click(screen.getByLabelText("Base profile"));
    await user.click(await screen.findByText("CIS Level 1 Workstation"));

    await user.click(screen.getByRole("button", { name: "Next" }));

    // Formik validation should still block progression until all required step 2 fields are set.
    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
    expect(
      screen.queryByText(/configure delivery settings/i),
    ).not.toBeInTheDocument();
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });

  it("should block on step 3 when delayed restart field is missing", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await goToStep3("Fix, restart, audit");

    await user.click(screen.getByRole("radio", { name: "Delayed" }));

    const delayInput = screen.getByRole("spinbutton");
    await user.clear(delayInput);
    await user.tab();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
    expect(
      screen.queryByText(/choose where this profile will apply/i),
    ).not.toBeInTheDocument();
  });

  it("should block on step 3 when repeat every is missing", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await goToStep3();

    await user.selectOptions(screen.getByLabelText("Schedule"), "recurring");

    const repeatEveryInput = screen.getByRole("spinbutton", {
      name: "Repeat every",
    });
    await user.clear(repeatEveryInput);
    await user.tab();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
    expect(
      screen.queryByText(/choose where this profile will apply/i),
    ).not.toBeInTheDocument();
  });

  it("should block on step 3 when recurring weekly has no day selected", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await goToStep3();

    await user.selectOptions(screen.getByLabelText("Schedule"), "recurring");

    const unitSelect = screen
      .getAllByRole("combobox")
      .find((el) => el.getAttribute("name") === "unit_of_time");
    expect(unitSelect).toBeInTheDocument();
    await user.selectOptions(unitSelect as HTMLElement, "WEEKLY");

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();
    expect(screen.getByText("Select at least one day.")).toBeInTheDocument();
    expect(
      screen.queryByText(/choose where this profile will apply/i),
    ).not.toBeInTheDocument();
  });

  it("should block on step 3 when recurring yearly has no month selected", async () => {
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await goToStep3();

    await user.selectOptions(screen.getByLabelText("Schedule"), "recurring");

    const unitSelect = screen
      .getAllByRole("combobox")
      .find((el) => el.getAttribute("name") === "unit_of_time");
    expect(unitSelect).toBeInTheDocument();
    await user.selectOptions(unitSelect as HTMLElement, "YEARLY");

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();
    expect(screen.getByText("Select at least one month.")).toBeInTheDocument();
    expect(
      screen.queryByText(/choose where this profile will apply/i),
    ).not.toBeInTheDocument();
  });

  it("should show an error notification when submit fails", async () => {
    setEndpointStatus({ path: "usg-profiles", status: "error" });

    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={() => undefined} />,
    );

    await goToConfirmationStep();

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("should show a success notification when submit succeeds", async () => {
    const showNotification = vi.fn();
    renderWithProviders(
      <USGProfileAddSidePanel showRetentionNotification={showNotification} />,
    );

    await goToConfirmationStep();

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(
      await screen.findByText(
        "You have successfully created Name USG profile.",
      ),
    ).toBeInTheDocument();
    expect(showNotification).toHaveBeenCalled();
  });
});
