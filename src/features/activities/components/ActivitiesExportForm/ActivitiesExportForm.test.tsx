import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import ActivitiesExportForm from "./ActivitiesExportForm";

type ActivitiesExportFormProps = ComponentProps<typeof ActivitiesExportForm>;

const defaultProps = {
  exportParams: { query: "status:succeeded" },
  activityCount: 10,
} satisfies ActivitiesExportFormProps;

const openAttributeGroup = async (
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp,
) => {
  await user.click(screen.getByRole("tab", { name }));
};

describe("ActivitiesExportForm", () => {
  it("shows the export details fields and activity attribute groups", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ActivitiesExportForm {...defaultProps} />);

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
      screen.getByRole("tab", { name: /audit & time/i }),
    ).toBeInTheDocument();

    await openAttributeGroup(user, /primary identity/i);
    expect(screen.getByRole("checkbox", { name: "ID" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Summary" }),
    ).toBeInTheDocument();
  });

  it("pre-selects the visible table columns and keeps Next disabled until a name is given", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ActivitiesExportForm {...defaultProps} />);

    await openAttributeGroup(user, /primary identity/i);
    expect(screen.getByRole("checkbox", { name: "Summary" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Status" })).toBeChecked();

    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toHaveAttribute("aria-disabled", "true");

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My activities export",
    );
    expect(nextButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("filters attributes by field name", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ActivitiesExportForm
        {...defaultProps}
        exportParams={{ query: "" }}
        activityCount={5}
      />,
    );

    await user.type(
      screen.getByRole("searchbox", { name: "Search attributes" }),
      "creator",
    );

    await openAttributeGroup(user, /audit & time/i);
    expect(
      screen.getByRole("checkbox", { name: "Creator" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "ID" }),
    ).not.toBeInTheDocument();
  });

  it("moves to the review step and back without losing the selected field", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ActivitiesExportForm
        {...defaultProps}
        exportParams={{ query: "" }}
        activityCount={5}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My activities export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "ID" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(
      screen.getByText(/review and reorder the columns/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Order for ID")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    await openAttributeGroup(user, /primary identity/i);
    expect(screen.getByRole("checkbox", { name: "ID" })).toBeChecked();
  });

  it("queues an activities export and shows a success notification with a status action", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ActivitiesExportForm {...defaultProps} activityCount={5} />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My activities export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "ID" }));
    await user.click(screen.getByRole("checkbox", { name: "Type" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    expect(await screen.findByText("TSV export in progress")).toBeVisible();
    expect(
      screen.getByText(
        'Your activities export "My activities export" for "status:succeeded" is being generated.',
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "View export status" }),
    ).toBeInTheDocument();
  });
});
