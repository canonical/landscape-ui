import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LicensesList from "./LicensesList";
import { licenses } from "@/tests/mocks/licenses";
import { DISPLAY_DATE_FORMAT } from "@/constants/constants";
import date from "@/libs/date";

const [unusedLicensed, licenseWithNoExpiration] = licenses;

describe("LicensesList", () => {
  it("renders column headers", () => {
    renderWithProviders(<LicensesList licenses={licenses} />);

    expect(
      screen.getByRole("columnheader", { name: "Expiration date" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        date(unusedLicensed.expiration_date).format(DISPLAY_DATE_FORMAT),
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: "Seats used" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "75" })).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: "Seats free" }),
    ).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: "License type" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ubuntu Pro")).toBeInTheDocument();
  });

  it("renders 'Never' when a license has no expiration date", () => {
    renderWithProviders(<LicensesList licenses={[licenseWithNoExpiration]} />);

    expect(screen.getByText("Never")).toBeInTheDocument();
  });

  it("renders zero seats used as plain text without a link", () => {
    renderWithProviders(<LicensesList licenses={[unusedLicensed]} />);

    expect(screen.getByText("0")).not.toHaveRole("link");
  });

  it("renders the empty message when there are no licenses", () => {
    renderWithProviders(<LicensesList licenses={[]} />);

    expect(screen.getByText("No licenses found.")).toBeInTheDocument();
  });
});
