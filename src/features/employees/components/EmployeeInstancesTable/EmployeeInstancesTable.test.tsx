import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmployeeInstancesTable from "./EmployeeInstancesTable";
import {
  instanceFailedActivityWithKey,
  instances,
} from "@/tests/mocks/instance";
import { EMPTY_STATE } from "./constants";
import { MASKED_VALUE } from "@/constants";

describe("EmployeeInstancesTable", () => {
  it("renders the heading and table when instances are provided", () => {
    renderWithProviders(<EmployeeInstancesTable instances={instances} />);

    expect(screen.getByText("Instances associated")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders each instance row with correct name link, status, recovery key, and actions", () => {
    renderWithProviders(<EmployeeInstancesTable instances={instances} />);

    instances.forEach((instance) => {
      const row = screen.getByText(instance.title).closest("tr");
      assert(row);

      const nameLink = within(row).getByRole("link", { name: instance.title });
      expect(nameLink).toBeInTheDocument();

      if (instance.parent) {
        expect(nameLink).toHaveAttribute(
          "href",
          `/instances/${instance.parent.id}/${instance.id}`,
        );
      } else {
        expect(nameLink).toHaveAttribute("href", `/instances/${instance.id}`);
      }

      const statusCell = within(row).getByRole("cell", {
        name: /status/i,
      });
      expect(statusCell).toBeInTheDocument();

      const recoveryKeyCell = within(row).getByRole("cell", {
        name: /recovery key/i,
      });
      expect(recoveryKeyCell).toBeInTheDocument();

      expect(
        within(row).getByLabelText(`${instance.title} profile actions`),
      ).toBeInTheDocument();
    });
  });

  it("shows inline recovery key warning indicator for failed activity with key", async () => {
    renderWithProviders(<EmployeeInstancesTable instances={instances} />);

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    const tableRow = rows.find((row) =>
      within(row).queryByRole("link", {
        name: instanceFailedActivityWithKey.title,
      }),
    );

    assert(tableRow);

    const recoveryKeyCell = within(tableRow).getByRole("cell", {
      name: /recovery key/i,
    });

    expect(
      await within(recoveryKeyCell).findByLabelText("Recovery key warning"),
    ).toBeInTheDocument();
    expect(within(recoveryKeyCell).getByText(MASKED_VALUE)).toBeInTheDocument();
  });

  it("renders the EmptyState when instances is null", () => {
    renderWithProviders(<EmployeeInstancesTable instances={null} />);

    expect(screen.getByText(EMPTY_STATE.title)).toBeInTheDocument();
    expect(screen.getByText(EMPTY_STATE.body)).toBeInTheDocument();
  });
});
