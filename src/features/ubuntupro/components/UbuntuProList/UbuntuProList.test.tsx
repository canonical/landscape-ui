import { renderWithProviders } from "@/tests/render";
import UbuntuProList from "./UbuntuProList";
import { instances } from "@/tests/mocks/instance";
import { screen, within } from "@testing-library/react";

const getInstanceWithMixedServiceStatus = () => {
  return instances.find(
    (instance) =>
      instance.ubuntu_pro_info?.attached &&
      instance.ubuntu_pro_info.services.some((s) => s.status === "enabled") &&
      instance.ubuntu_pro_info.services.some((s) => s.status === "disabled"),
  );
};

const instanceWithUbuntuPro = getInstanceWithMixedServiceStatus();

const ubuntuProServices =
  instanceWithUbuntuPro?.ubuntu_pro_info?.attached &&
  instanceWithUbuntuPro?.ubuntu_pro_info
    ? instanceWithUbuntuPro.ubuntu_pro_info.services
    : [];

describe("Ubuntu Pro List", () => {
  it("renders Ubuntu Pro List", () => {
    renderWithProviders(<UbuntuProList services={ubuntuProServices} />);
    expect(screen.getByText(/services/i)).toBeInTheDocument();
    for (const service of ubuntuProServices) {
      expect(screen.getByText(service.name)).toBeInTheDocument();
    }
  });

  it("renders all column headers", () => {
    renderWithProviders(<UbuntuProList services={ubuntuProServices} />);
    const headers = ["Name", "Entitled", "Status", "Description"];
    for (const header of headers) {
      expect(
        screen.getByRole("columnheader", {
          name: header,
        }),
      ).toBeInTheDocument();
    }
  });

  it("shows enabled icon status for an enabled service", () => {
    renderWithProviders(<UbuntuProList services={ubuntuProServices} />);
    const enabledService = ubuntuProServices.find(
      (service) => service.status === "enabled",
    );
    expect(enabledService).toBeDefined();

    const row = screen.getByRole("row", {
      name: `${enabledService?.name} Entitled Status Description`,
    });

    const enabledServiceCellIcon = within(row).getByRole("cell", {
      name: /status/i,
    });

    expect(enabledServiceCellIcon).toHaveIcon("status-succeeded-small");
  });

  it("shows disabled icon status for a disabled service", () => {
    renderWithProviders(<UbuntuProList services={ubuntuProServices} />);
    const disabledService = ubuntuProServices.find(
      (service) => service.status === "disabled",
    );
    expect(disabledService).toBeDefined();

    const row = screen.getByRole("row", {
      name: `${disabledService?.name} Entitled Status Description`,
    });

    const disabledServiceCellIcon = within(row).getByRole("cell", {
      name: /status/i,
    });

    expect(disabledServiceCellIcon).toHaveIcon("status-failed-small");
  });
});
