import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import SecurityProfileDownloadAuditForm from "./SecurityProfileDownloadAuditForm";

describe("SecurityProfileDownloadAuditForm", () => {
  it("should start an activity", async () => {
    renderWithProviders(<SecurityProfileDownloadAuditForm />);

    await userEvent.click(
      await screen.findByRole("button", { name: "Generate CSV" }),
    );

    expect(
      await screen.findByText("Your requested audit is ready:"),
    ).toBeInTheDocument();
  });
});
