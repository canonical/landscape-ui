import {
  instances,
  windowsInstance,
  windowsInstanceWithUbuntuPro,
} from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import UbuntuProPanel from "./UbuntuProPanel";
import { screen } from "@testing-library/react";

const instanceWithUbuntuPro =
  instances.find((instance) => instance.ubuntu_pro_info) ?? instances[0];

const instanceWithoutUbuntuPro =
  instances.find((instance) => !instance.ubuntu_pro_info) ?? instances[0];

describe("renders Ubuntu Pro Panel", () => {
  it("renders Ubuntu Pro Panel with Ubuntu Pro entitlement", () => {
    renderWithProviders(<UbuntuProPanel instance={instanceWithUbuntuPro} />);
  });
  it("renders empty Ubuntu Pro Panel", () => {
    renderWithProviders(<UbuntuProPanel instance={instanceWithoutUbuntuPro} />);
    expect(screen.getByText(/no ubuntu pro entitlement/i)).toBeInTheDocument();
  });

  it("renders the subscription of a Windows host without token actions", () => {
    renderWithProviders(
      <UbuntuProPanel instance={windowsInstanceWithUbuntuPro} />,
    );

    expect(screen.getByText(/account information/i)).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Auto enabled" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /edit token/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the empty state of a Windows host without an attach action", () => {
    renderWithProviders(<UbuntuProPanel instance={windowsInstance} />);

    expect(screen.getByText(/no ubuntu pro entitlement/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /attach ubuntu pro/i }),
    ).not.toBeInTheDocument();
  });
});
