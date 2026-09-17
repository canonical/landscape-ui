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
  it("propagates the fetched license URL to the download button", async () => {
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

    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenCalledWith(
      selfHostedLicense.license_url,
      "_blank",
      "noopener,noreferrer",
    );
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

    await user.click(
      screen.getByRole("button", { name: "Regenerate private token" }),
    );

    expect(
      await screen.findByText(
        "Private token and license download URL regenerated",
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
  });
});
