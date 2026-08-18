import { setEndpointStatus } from "@/tests/controllers/controller";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import ScriptProfileEditSidePanel from "./ScriptProfileEditSidePanel";

const [scriptProfile] = scriptProfiles;

describe("ScriptProfileEditSidePanel", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<ScriptProfileEditSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the edit header and form for the loaded profile", async () => {
    renderWithProviders(
      <ScriptProfileEditSidePanel />,
      undefined,
      `/?name=${scriptProfile.id}`,
    );

    expect(
      await screen.findByText(`Edit ${scriptProfile.title}`),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("saves changes and shows a success notification", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ScriptProfileEditSidePanel />,
      undefined,
      `/?name=${scriptProfile.id}`,
    );

    await user.click(
      await screen.findByRole("button", { name: "Save changes" }),
    );

    expect(
      await screen.findByText(
        `You have successfully saved changes for ${scriptProfile.title}`,
      ),
    ).toBeInTheDocument();
  });

  it("formats the recurring trigger start date from the fetched profile", async () => {
    const recurringProfile = {
      ...scriptProfile,
      id: 999,
      title: "Recurring profile",
      trigger: {
        trigger_type: "recurring",
        interval: "0 0 * * *",
        start_after: "2024-01-01T00:00:00Z",
        last_run: "",
        next_run: "",
      },
    };

    setEndpointStatus({
      path: "script-profiles/:profileId",
      status: "variant",
      response: recurringProfile,
    });

    renderWithProviders(
      <ScriptProfileEditSidePanel />,
      undefined,
      `/?name=${recurringProfile.id}`,
    );

    expect(
      await screen.findByText(`Edit ${recurringProfile.title}`),
    ).toBeInTheDocument();

    const startDate = await screen.findByLabelText("Start date");
    expect(startDate).toHaveDisplayValue(/^2024-01-01T00:00/);
  });

  it("formats the one-time trigger timestamp from the fetched profile", async () => {
    const oneTimeProfile = {
      ...scriptProfile,
      id: 998,
      title: "One time profile",
      trigger: {
        trigger_type: "one_time",
        timestamp: "2024-06-15T12:30:00Z",
        last_run: "",
        next_run: "",
      },
    };

    setEndpointStatus({
      path: "script-profiles/:profileId",
      status: "variant",
      response: oneTimeProfile,
    });

    renderWithProviders(
      <ScriptProfileEditSidePanel />,
      undefined,
      `/?name=${oneTimeProfile.id}`,
    );

    expect(
      await screen.findByText(`Edit ${oneTimeProfile.title}`),
    ).toBeInTheDocument();

    const date = await screen.findByLabelText("Date");
    expect(date).toHaveDisplayValue(/^2024-06-15T12:30/);
  });
});
