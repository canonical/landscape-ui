import { renderWithProviders } from "@/tests/render";
import {
  regeneratedSelfHostedLicense,
  selfHostedLicense,
} from "@/tests/mocks/selfHostedLicense";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SelfHostedLicenseContainer from "./SelfHostedLicenseContainer";

describe("SelfHostedLicenseContainer", () => {
  it("propagates the fetched license URL to the download button and curl snippet", async () => {
    renderWithProviders(<SelfHostedLicenseContainer />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download license file" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "CODE" &&
          element.textContent ===
            `sudo curl -so /etc/landscape/license.txt \\
${selfHostedLicense.license_url}`,
      ),
    ).toBeInTheDocument();
  });

  it("replaces the download URL everywhere after regenerating the license", async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);

    renderWithProviders(<SelfHostedLicenseContainer />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download license file" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    await user.click(screen.getByRole("button", { name: "Regenerate token" }));

    expect(
      await screen.findByText(
        "You have successfully regenerated your APT credentials",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenCalledWith(
      regeneratedSelfHostedLicense.license_url,
      "_blank",
      "noopener,noreferrer",
    );

    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "CODE" &&
          element.textContent ===
            `sudo curl -so /etc/landscape/license.txt \\
${regeneratedSelfHostedLicense.license_url}`,
      ),
    ).toBeInTheDocument();
  });
});
