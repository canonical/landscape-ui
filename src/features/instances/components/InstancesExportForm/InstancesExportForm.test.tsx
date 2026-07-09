import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
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
      screen.getByRole("tab", { name: /system ids & agent logs/i }),
    ).toBeInTheDocument();
    await openAttributeGroup(user, /business logic/i);
    expect(
      screen.getByRole("checkbox", { name: "Annotations" }),
    ).toBeInTheDocument();
  });

  it("pre-selects the visible table columns", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
      />,
    );

    // Attributes matching the visible table columns are pre-selected on open.
    await openAttributeGroup(user, /primary identity/i);
    expect(
      screen.getByRole("checkbox", { name: "Instance name" }),
    ).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Status" })).toBeChecked();
  });

  it("filters attributes by field name", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
      />,
    );

    const search = screen.getByRole("searchbox", { name: "Search attributes" });
    await user.type(search, "host");

    expect(
      screen.getByRole("checkbox", { name: "Hostname" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Instance name" }),
    ).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "no-such-attribute");

    expect(
      screen.getByText("No attributes match your search."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /primary identity/i }),
    ).not.toBeInTheDocument();
  });

  it("matches a category name and shows all of its attributes", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
      />,
    );

    const search = screen.getByRole("searchbox", { name: "Search attributes" });
    await user.type(search, "primary");

    // The category title matches, so the whole group is shown including fields
    // whose labels do not contain the search term.
    expect(
      screen.getByRole("checkbox", { name: "Instance name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Hostname" }),
    ).toBeInTheDocument();
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

    expect(await screen.findByRole("button", { name: "Next" })).toBeInTheDocument();
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

  it("restores focus to the move button after a keyboard reorder so moves can be repeated", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Weekly export",
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    const [firstDownButton] = screen.getAllByRole("button", {
      name: /move .* down/i,
    });
    const downLabel = firstDownButton?.getAttribute("aria-label") ?? "";

    await user.click(firstDownButton as HTMLElement);

    // The moved row's own "down" button regains focus at its new position so
    // the user can keep pressing to move it further down.
    const focusedDownButton = screen.getByRole("button", { name: downLabel });
    expect(focusedDownButton).toHaveFocus();

    // A second move keeps focus on the same button (continuous movement).
    await user.click(focusedDownButton);
    expect(screen.getByRole("button", { name: downLabel })).toHaveFocus();
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
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Generate TSV" }),
      ).not.toBeDisabled();
    });
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

  it("pops one sidePath entry on successful export", async () => {
    const user = userEvent.setup();
    const LocationDisplay = () => {
      const { search } = useLocation();
      return <div data-testid="location-display">{search}</div>;
    };

    renderWithProviders(
      <>
        <InstancesExportForm
          exportParams={{
            query: "",
            archived_only: false,
            wsl_children: false,
            wsl_parents: false,
          }}
          selectedInstanceIds={[1, 2]}
        />
        <LocationDisplay />
      </>,
      undefined,
      "/?sidePath=view,export",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Weekly export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Instance name" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Generate TSV" }),
      ).not.toBeDisabled();
    });
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    expect(await screen.findByText("TSV export in progress")).toBeVisible();

    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "sidePath=view",
    );
    expect(screen.getByTestId("location-display")).not.toHaveTextContent(
      "sidePath=view,export",
    );
  });
});
