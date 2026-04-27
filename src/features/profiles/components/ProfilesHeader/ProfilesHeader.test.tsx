import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfilesHeader from "./ProfilesHeader";
import { ProfileTypes } from "../../helpers";
import userEvent from "@testing-library/user-event";

describe("ProfilesHeader", () => {
  it("renders script status filter and add button", async () => {
    renderWithProviders(<ProfilesHeader type={ProfileTypes.script} />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Pass rate" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Add profile")).toBeInTheDocument();

    const statusFilter = screen.getByRole("button", { name: "Status" });
    await userEvent.click(statusFilter);

    const archivedOption = screen.getByRole("button", { name: "Archived" });
    await userEvent.click(archivedOption);
    expect(screen.getByText("Status: Archived")).toBeInTheDocument();
  });

  it("renders security status filter and pass rate filter", async () => {
    renderWithProviders(<ProfilesHeader type={ProfileTypes.security} />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Status" })).toBeInTheDocument();
    expect(screen.queryByText(/add/i)).not.toBeInTheDocument();

    const passRateFilter = screen.getByRole("button", { name: "Pass rate" });
    await userEvent.click(passRateFilter);

    const passRateFromInput = screen.getByRole("spinbutton", { name: "From" });
    await userEvent.type(passRateFromInput, "50{enter}");
    expect(screen.getByText("From pass rate: 50%")).toBeInTheDocument();
  });

  it("renders only search chips for non-archivable profile types", async () => {
    renderWithProviders(<ProfilesHeader type={ProfileTypes.package} />);

    expect(
      screen.queryByRole("button", { name: "Status" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Pass rate" }),
    ).not.toBeInTheDocument();

    const search = screen.getByRole("searchbox");
    await userEvent.type(search, "search{enter}");
    expect(screen.getByText("Search: search")).toBeInTheDocument();
  });
});
