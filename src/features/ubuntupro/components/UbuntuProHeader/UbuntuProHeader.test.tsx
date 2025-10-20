import { renderWithProviders } from "@/tests/render";
import UbuntuProHeader from "./UbuntuProHeader";
import { getInstanceWithUbuntuPro } from "../../helpers";
import { instances } from "@/tests/mocks/instance";
import { INSTANCES_PATHS } from "@/libs/routes/instances";
import { screen } from "@testing-library/react";

const instanceWithUbuntuPro = getInstanceWithUbuntuPro(instances);
const singleInstancePath = `/${INSTANCES_PATHS.root}/${INSTANCES_PATHS.single}`;

describe("UbuntuProHeader", () => {
  if (!instanceWithUbuntuPro) {
    throw new Error("No instance with Ubuntu Pro found in mock data");
  }

  const ubuntuProData = instanceWithUbuntuPro.ubuntu_pro_info;
  if (ubuntuProData?.result !== "success") {
    throw new Error("Invalid ubuntu_pro_info");
  }

  it("renders header with account information title", () => {
    renderWithProviders(
      <UbuntuProHeader instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    expect(screen.getByText(/account information/i)).toBeInTheDocument();
  });

  it("renders Ubuntu Pro dashboard link", () => {
    renderWithProviders(
      <UbuntuProHeader instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    const link = screen.getByRole("link", {
      name: "Ubuntu Pro Dashboard",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://ubuntu.com/pro/dashboard");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });
});
