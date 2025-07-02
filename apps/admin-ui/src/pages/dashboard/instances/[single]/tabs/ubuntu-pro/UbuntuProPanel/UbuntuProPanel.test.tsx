import { instances } from "@/tests/mocks/instance";
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
});
