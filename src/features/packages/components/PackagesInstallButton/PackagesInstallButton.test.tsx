import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesInstallButton from "./PackagesInstallButton";
import { ROUTES } from "@/libs/routes";

const instanceId = 1;
const instancePageUrl = ROUTES.instances.details.single(instanceId);
const instancePath = `${ROUTES.instances.root()}/:instanceId`;

describe("PackagesInstallButton", () => {
  const user = userEvent.setup();

  it("renders install button with positive appearance", () => {
    renderWithProviders(
      <PackagesInstallButton />,
      {},
      instancePageUrl,
      instancePath,
    );

    const button = screen.getByRole("button", { name: "Install" });
    expect(button).toBeInTheDocument();
  });

  it("opens install packages form when button is clicked", async () => {
    renderWithProviders(
      <PackagesInstallButton />,
      {},
      instancePageUrl,
      instancePath,
    );

    await user.click(screen.getByRole("button", { name: "Install" }));

    expect(
      await screen.findByRole("heading", { name: "Install packages" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });
});
