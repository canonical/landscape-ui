import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InstancesExportForm from "./InstancesExportForm";

const openAttributeGroup = async (
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp,
) => {
  await user.click(screen.getByRole("tab", { name }));
};

describe("InstancesExportForm", () => {
  it("shows the export details fields and instance attribute groups", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
        instanceCount={1}
      />,
    );

    expect(
      screen.getByText(/select the attributes you want to include/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Export name" })).toBeVisible();
    expect(screen.getByLabelText("Keep until")).toBeVisible();
    expect(
      screen.getByRole("searchbox", { name: "Search attributes" }),
    ).toBeVisible();
    expect(
      screen.getByRole("tab", { name: /primary identity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", {
        name: /granular metadata & deep diagnostics/i,
      }),
    ).toBeInTheDocument();
    await openAttributeGroup(user, /business logic/i);
    expect(
      screen.getByRole("checkbox", { name: "Annotations" }),
    ).toBeInTheDocument();
  });

  it("pre-selects the visible table columns and keeps Next disabled until a name is given", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
        instanceCount={1}
      />,
    );

    // Attributes matching the visible table columns are pre-selected on open.
    await openAttributeGroup(user, /primary identity/i);
    expect(
      screen.getByRole("checkbox", { name: "Instance name" }),
    ).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Status" })).toBeChecked();

    // A name is still required before proceeding.
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toHaveAttribute("aria-disabled", "true");

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Weekly export",
    );
    expect(nextButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("filters attributes by field name without matching group titles", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
        instanceCount={1}
      />,
    );

    const search = screen.getByRole("searchbox", { name: "Search attributes" });
    await user.type(search, "host");

    await openAttributeGroup(user, /primary identity/i);
    expect(
      screen.getByRole("checkbox", { name: "Hostname" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Instance name" }),
    ).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "primary");

    expect(
      screen.getByText("No attributes match your search."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /primary identity/i }),
    ).not.toBeInTheDocument();
  });

  it("shows attribute validation after clearing every pre-selected field", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
        instanceCount={1}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Weekly export",
    );

    const uncheck = async (...labels: string[]) => {
      for (const label of labels) {
        await user.click(screen.getByLabelText(label));
      }
    };
    await uncheck("Instance name", "Status", "OS");
    await uncheck("Security upgrades count");
    await uncheck("Tags", "Ubuntu Pro expiration");
    await uncheck("Availability zone", "Last ping", "Regular upgrades count");

    expect(screen.getByText("Select at least one attribute")).toHaveClass(
      "p-form-validation__message",
    );
  });

  it("moves to the review step and back without losing selected fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
        instanceCount={1}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Weekly export",
    );
    // Visible-column attributes are pre-selected, so proceed straight to review.
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(
      screen.getByText(/review and reorder the columns/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Order for Instance name"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Order for Status")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    await openAttributeGroup(user, /primary identity/i);
    expect(
      screen.getByRole("checkbox", { name: "Instance name" }),
    ).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Status" })).toBeChecked();
  });

  it("keeps the order input focused while typing", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
        instanceCount={1}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Weekly export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Instance name" }));
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    const orderInput = screen.getByLabelText("Order for Hostname");

    await user.click(orderInput);
    await user.keyboard("{Backspace}1");

    expect(orderInput).toHaveFocus();
    expect(orderInput).toHaveValue(1);
  });

  it("queues an export and shows a success notification with a status action", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
        instanceCount={8}
        selectedInstanceIds={[1, 2]}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Weekly export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Instance name" }));
    await openAttributeGroup(user, /business logic/i);
    await user.click(screen.getByRole("checkbox", { name: "Annotations" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    expect(await screen.findByText("TSV export in progress")).toBeVisible();
    expect(
      screen.getByText(
        'Your instances export "Weekly export" for 2 selected instances is being generated.',
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "View export status" }),
    ).toBeInTheDocument();
  });
});
