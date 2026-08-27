import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import AccessGroupAdministratorsTable from "./AccessGroupAdministratorsTable";

const renderComponent = (accessGroupName: string) =>
  renderWithProviders(
    <AccessGroupAdministratorsTable accessGroupName={accessGroupName} />,
  );

describe("AccessGroupAdministratorsTable", () => {
  it("renders administrator and role columns", async () => {
    renderComponent("desktop");

    expect(
      await screen.findByRole("columnheader", { name: "Administrator" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Role" }),
    ).toBeInTheDocument();
  });

  it("groups multiple roles under the same administrator", async () => {
    renderComponent("global");

    const row = (await screen.findByText("Bob Mellow")).closest("tr");
    assert(row);
    expect(within(row).getByText("GlobalAdmin")).toBeInTheDocument();
    expect(within(row).getByText("Auditor")).toBeInTheDocument();
    expect(within(row).getByText("Officer")).toBeInTheDocument();
    expect(within(row).getByText("TestRole")).toBeInTheDocument();
  });

  it("shows empty message when no roles are associated", async () => {
    renderComponent("singular-access-group");

    expect(
      await screen.findByText(
        "No administrators have roles associated with this access group.",
      ),
    ).toBeInTheDocument();
  });
});
