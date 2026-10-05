import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { StaffAccountLicense } from "@/features/super-admin";
import date from "@/libs/date";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StaffAccountLicenses from "./StaffAccountLicenses";

const expiringLicense: StaffAccountLicense = {
  expires: "2027-01-01T00:00:00Z",
  seats: 50,
  type: "UbuntuPro",
};

const perpetualLicense: StaffAccountLicense = {
  expires: null,
  seats: 20,
  type: "LDSBasic",
};

describe("StaffAccountLicenses", () => {
  it("renders the type, seats and expiry of every license", () => {
    const { container } = renderWithProviders(
      <StaffAccountLicenses licenses={[expiringLicense, perpetualLicense]} />,
    );

    expect(container).toHaveTexts(["Type", "Seats", "Expires"]);
    expect(screen.getByText(expiringLicense.type)).toBeInTheDocument();
    expect(screen.getByText(String(expiringLicense.seats))).toBeInTheDocument();
    expect(
      screen.getByText(
        date(expiringLicense.expires).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(perpetualLicense.type)).toBeInTheDocument();
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders the empty message without licenses", () => {
    renderWithProviders(<StaffAccountLicenses licenses={[]} />);

    expect(
      screen.getByText("This account has no licenses."),
    ).toBeInTheDocument();
  });
});
