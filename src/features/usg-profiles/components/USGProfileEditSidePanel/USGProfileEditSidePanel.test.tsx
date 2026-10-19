import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import USGProfileEditSidePanel from "./USGProfileEditSidePanel";

const [, usgProfile] = usgProfiles;

describe("USGProfileEditSidePanel", () => {
  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<USGProfileEditSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the edit header and pre-filled form", async () => {
    renderWithProviders(
      <USGProfileEditSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    expect(
      await screen.findByText(`Edit ${usgProfile.title}`),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      usgProfile.title,
    );
    expect(
      await screen.findByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("saves changes and shows a success notification on submit", async () => {
    renderWithProviders(
      <USGProfileEditSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Save changes" }),
    );

    expect(
      await screen.findByText(
        `You have successfully saved changes for ${usgProfile.title} USG profile.`,
      ),
    ).toBeInTheDocument();
  });

  it("populates the end date from a saved compact UTC UNTIL", async () => {
    const profile = {
      ...usgProfile,
      schedule: "FREQ=DAILY;INTERVAL=7;UNTIL=20271231T120000Z",
    };
    setEndpointStatus({
      path: "usg-profiles",
      status: "variant",
      response: [profile],
    });

    renderWithProviders(
      <USGProfileEditSidePanel />,
      undefined,
      `/?name=${profile.id}`,
    );

    expect(await screen.findByLabelText("End date")).toHaveValue(
      "2027-12-31T12:00",
    );
    expect(screen.getByLabelText("Ends")).toHaveValue("on-a-date");
  });
});
