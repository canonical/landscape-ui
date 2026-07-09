import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import ActivitiesExportForm from "./ActivitiesExportForm";

type ActivitiesExportFormProps = ComponentProps<typeof ActivitiesExportForm>;

const defaultProps = {
  exportParams: { query: "status:succeeded" },
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

  it("shows a validation error when Next is clicked without a name, then clears it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ActivitiesExportForm {...defaultProps} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(screen.getByText("This field is required")).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My activities export",
    );

    expect(
      screen.queryByText("This field is required"),
    ).not.toBeInTheDocument();
  });

  it("filters attributes by field name", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ActivitiesExportForm {...defaultProps} exportParams={{ query: "" }} />,
    );

    await user.type(
      screen.getByRole("searchbox", { name: "Search attributes" }),
      "creator",
    );

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
      <ActivitiesExportForm {...defaultProps} exportParams={{ query: "" }} />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My activities export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "ID" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(
      await screen.findByText(/review and reorder the columns/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Order for ID")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(
      await screen.findByRole("button", { name: "Next" }),
    ).toBeInTheDocument();
    await openAttributeGroup(user, /primary identity/i);
    expect(screen.getByRole("checkbox", { name: "ID" })).toBeChecked();
  });

  it("queues an activities export and shows a success notification with a status action", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ActivitiesExportForm {...defaultProps} selectedActivityIds={[1, 2]} />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My activities export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "ID" }));
    await user.click(screen.getByRole("checkbox", { name: "Type" }));
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
        'Your activities export "My activities export" for 2 selected activities is being generated.',
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
        <ActivitiesExportForm {...defaultProps} selectedActivityIds={[1, 2]} />
        <LocationDisplay />
      </>,
      undefined,
      "/?sidePath=view,export",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My activities export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "ID" }));
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
