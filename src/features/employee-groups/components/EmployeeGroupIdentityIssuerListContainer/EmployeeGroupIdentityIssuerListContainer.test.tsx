import { describe, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import EmployeeGroupIdentityIssuerListContainer from "./EmployeeGroupIdentityIssuerListContainer";
import { renderWithProviders } from "@/tests/render";
import { oidcIssuers } from "@/tests/mocks/oidcIssuers";

const directoryIssuers = oidcIssuers.filter((issuer) =>
  issuer.available_features.includes("directory-import"),
);

describe("EmployeeGroupIdentityIssuerListContainer", () => {
  it("renders issuer list", () => {
    renderWithProviders(<EmployeeGroupIdentityIssuerListContainer />);

    waitFor(() => {
      for (const issuer of directoryIssuers) {
        expect(
          screen.getByText(issuer.provider.provider_label),
        ).toBeInTheDocument();
      }
    });
  });
});
