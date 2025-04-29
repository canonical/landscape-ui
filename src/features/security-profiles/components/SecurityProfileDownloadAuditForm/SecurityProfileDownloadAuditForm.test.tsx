import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import SecurityProfileDownloadAuditForm from "./SecurityProfileDownloadAuditForm";

describe("SecurityProfileDownloadAuditForm", () => {
  it("should start an activity", async () => {
    renderWithProviders(
      <SecurityProfileDownloadAuditForm profileId={securityProfiles[0].id} />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Generate CSV" }),
    );

    expect(
      await screen.findByText("Your requested audit is ready:"),
    ).toBeInTheDocument();
  });
});
