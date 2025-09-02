import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import PackageProfileDuplicateForm from "./PackageProfileDuplicateForm";

describe("PackageProfileDuplicateForm", () => {
  it("submits", async () => {
    renderWithProviders(
      <PackageProfileDuplicateForm profile={packageProfiles[0]} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(screen.getByText("Profile duplicated")).toBeInTheDocument();
  });

  it("catches errors", async () => {
    renderWithProviders(
      <PackageProfileDuplicateForm profile={packageProfiles[0]} />,
    );

    setEndpointStatus("error");
    await userEvent.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(screen.queryByText("Profile duplicated")).not.toBeInTheDocument();
    expect(
      screen.getByText("Request failed with status code 500"),
    ).toBeInTheDocument();
  });
});
