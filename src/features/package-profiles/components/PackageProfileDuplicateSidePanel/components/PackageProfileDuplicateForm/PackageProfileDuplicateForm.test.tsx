import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import PackageProfileDuplicateForm from "./PackageProfileDuplicateForm";

describe("PackageProfileDuplicateForm", () => {
  const user = userEvent.setup();

  it("submits", async () => {
    renderWithProviders(
      <PackageProfileDuplicateForm profile={packageProfiles[0]} />,
    );

    await user.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(screen.getByText("Profile duplicated")).toBeInTheDocument();
  });

  it("catches errors", async () => {
    renderWithProviders(
      <PackageProfileDuplicateForm profile={packageProfiles[0]} />,
    );

    setEndpointStatus("error");
    await user.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(screen.queryByText("Profile duplicated")).not.toBeInTheDocument();
    expect(
      screen.getByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
