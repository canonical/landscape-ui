import { usgProfiles } from "@/tests/mocks/usgProfiles";
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
});
