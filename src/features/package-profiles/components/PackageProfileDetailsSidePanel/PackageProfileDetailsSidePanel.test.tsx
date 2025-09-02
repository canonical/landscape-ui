import { setEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import PackageProfileDetailsSidePanel from "./PackageProfileDetailsSidePanel";

const renderAndRemove = async () => {
  renderWithProviders(
    <PackageProfileDetailsSidePanel />,
    undefined,
    `?profile=${packageProfiles[0].name}`,
  );

  expect(
    await screen.findByRole("heading", { name: packageProfiles[0].title }),
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", {
      name: `Remove ${packageProfiles[0].title} package profile`,
    }),
  );
  const modal = screen.getByRole("dialog");
  const button = within(modal).getByRole("button", { name: "Remove" });
  expect(button).toBeDisabled();
  await userEvent.type(
    within(modal).getByRole("textbox"),
    `remove ${packageProfiles[0].title}`,
  );
  expect(button).toBeEnabled();
  await userEvent.click(button);
};

describe("PackageProfileDetailsSidePanel", () => {
  it("removes", async () => {
    await renderAndRemove();
    expect(screen.getByText("Package profile removed")).toBeInTheDocument();
  });

  it("catches errors while removing", async () => {
    setEndpointStatus("error");
    await renderAndRemove();
    expect(
      screen.queryByText("Package profile removed"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Request failed with status code 500"),
    ).toBeInTheDocument();
  });
});
