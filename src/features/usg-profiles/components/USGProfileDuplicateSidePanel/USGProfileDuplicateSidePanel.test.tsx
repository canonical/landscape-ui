import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import USGProfileDuplicateSidePanel from "./USGProfileDuplicateSidePanel";

const [, usgProfile] = usgProfiles;

describe("USGProfileDuplicateSidePanel", () => {
  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<USGProfileDuplicateSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the duplicate header and pre-fills the copied title", async () => {
    renderWithProviders(
      <USGProfileDuplicateSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    expect(
      await screen.findByText(`Duplicate ${usgProfile.title}`),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      `${usgProfile.title} copy`,
    );
    expect(
      await screen.findByRole("button", { name: "Duplicate" }),
    ).toBeInTheDocument();
  });

  it("duplicates the profile and shows a success notification", async () => {
    renderWithProviders(
      <USGProfileDuplicateSidePanel />,
      undefined,
      `/?name=${usgProfile.id}`,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Duplicate" }),
    );
  });
});
