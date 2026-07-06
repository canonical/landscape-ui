import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import USGProfileAddSidePanel from "./USGProfileAddSidePanel";

describe("USGProfileAddSidePanel", () => {
  const user = userEvent.setup();

  const goToStep2 = async () => {
    await user.type(screen.getByRole("textbox", { name: "Title" }), "Name");
    await user.click(await screen.findByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
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

    await goToStep2();

    await user.click(screen.getByLabelText("Base profile"));
    await user.click(await screen.findByText("CIS Level 1 Workstation"));

    await user.click(screen.getByLabelText("Mode"));
    await user.click(await screen.findByText("Fix, restart, audit"));

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();

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

    await goToStep2();

    await user.click(screen.getByLabelText("Base profile"));
    await user.click(await screen.findByText("CIS Level 1 Workstation"));

    await user.click(screen.getByLabelText("Mode"));
    await user.click(await screen.findByText("Audit only"));

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();

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

    await goToStep2();

    await user.click(screen.getByLabelText("Base profile"));
    await user.click(await screen.findByText("CIS Level 1 Workstation"));

    await user.click(screen.getByLabelText("Mode"));
    await user.click(await screen.findByText("Audit only"));

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();

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

    await goToStep2();

    await user.click(screen.getByLabelText("Base profile"));
    await user.click(await screen.findByText("CIS Level 1 Workstation"));

    await user.click(screen.getByLabelText("Mode"));
    await user.click(await screen.findByText("Audit only"));

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();

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
});
