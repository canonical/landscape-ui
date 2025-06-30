import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import PackageProfileDuplicateForm from "./PackageProfileDuplicateForm";

describe("PackageProfileDuplicateForm", () => {
  const [profile] = packageProfiles;

  beforeEach(() => {
    renderWithProviders(<PackageProfileDuplicateForm profile={profile} />);
  });

  it("should pre-fill the form with data from the original profile", async () => {
    expect(await screen.findByRole("textbox", { name: /name/i })).toHaveValue(
      `${profile.title} (copy)`,
    );
    expect(
      await screen.findByRole("textbox", { name: /description/i }),
    ).toHaveValue(profile.description);
    if (profile.all_computers) {
      expect(
        await screen.findByRole("checkbox", { name: /all instances/i }),
      ).toBeChecked();
    }
  });
});
