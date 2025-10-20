import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { INSTANCES_PATHS } from "@/libs/routes/instances";
import UbuntuProInfoRow from "./UbuntuProInfoRow";
import { screen } from "@testing-library/react";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { getInstanceWithUbuntuPro } from "../../helpers";

const instanceWithUbuntuPro = getInstanceWithUbuntuPro(instances);

const singleInstancePath = `/${INSTANCES_PATHS.root}/${INSTANCES_PATHS.single}`;

describe("UbuntuProInfoRow", () => {
  if (!instanceWithUbuntuPro) {
    throw new Error("No instance with Ubuntu Pro found in mock data");
  }

  const ubuntuProData = instanceWithUbuntuPro.ubuntu_pro_info;
  if (ubuntuProData?.result !== "success") {
    throw new Error("Invalid ubuntu_pro_info");
  }

  it("renders account information field", () => {
    const { container } = renderWithProviders(
      <UbuntuProInfoRow instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    if (ubuntuProData.account?.name) {
      expect(container).toHaveInfoItem("Account", ubuntuProData.account.name);
    } else {
      expect(screen.getByText("Account")).toBeInTheDocument();
    }
  });

  it("renders valid until field with formatted date", () => {
    const { container } = renderWithProviders(
      <UbuntuProInfoRow instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    if (ubuntuProData.expires && moment(ubuntuProData.expires).isValid()) {
      const formattedDate = moment(ubuntuProData.expires).format(
        DISPLAY_DATE_TIME_FORMAT,
      );
      expect(container).toHaveInfoItem("Valid Until", formattedDate);
    } else {
      expect(screen.getByText("Valid Until")).toBeInTheDocument();
    }
  });

  it("renders technical support level field", () => {
    const { container } = renderWithProviders(
      <UbuntuProInfoRow instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    if (ubuntuProData.contract?.tech_support_level) {
      expect(container).toHaveInfoItem(
        "Technical Support Level",
        ubuntuProData.contract.tech_support_level,
      );
    } else {
      expect(screen.getByText("Technical Support Level")).toBeInTheDocument();
    }
  });

  it("renders token field", () => {
    renderWithProviders(
      <UbuntuProInfoRow instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    expect(screen.getByText("Token")).toBeInTheDocument();
  });

  it("renders masked token value", () => {
    renderWithProviders(
      <UbuntuProInfoRow instance={instanceWithUbuntuPro} />,
      undefined,
      `/instances/${instanceWithUbuntuPro.id}`,
      singleInstancePath,
    );

    expect(screen.getByText("****************")).toBeInTheDocument();
  });
});
