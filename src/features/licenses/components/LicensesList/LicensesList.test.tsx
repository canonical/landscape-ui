import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LicensesList from "./LicensesList";
import { licenses } from "@/tests/mocks/licenses";

describe("LicensesList", () => {
  it("renders column headers", () => {
    renderWithProviders(<LicensesList licenses={licenses} />);

    expect(
      screen.getByRole("columnheader", { name: "Expiration date" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Nov 29, 2026")).toBeInTheDocument();

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
    const licenseWithNoExpiration = licenses.find(
      (license) => license.expiration_date === null,
    );
    assert(licenseWithNoExpiration, "Needs license mock with no expiration");

    renderWithProviders(<LicensesList licenses={[licenseWithNoExpiration]} />);

    expect(screen.getByText("Never")).toBeInTheDocument();
  });

  it("renders zero seats used as plain text without a link", () => {
    const licenseWithNoSeatsUsed = licenses.find(
      (license) => license.used_seats === 0,
    );

    assert(licenseWithNoSeatsUsed, "Needs license mock with 0 seats used");

    renderWithProviders(<LicensesList licenses={[licenseWithNoSeatsUsed]} />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the empty message when there are no licenses", () => {
    renderWithProviders(<LicensesList licenses={[]} />);

    expect(screen.getByText("No licenses found.")).toBeInTheDocument();
  });
});
