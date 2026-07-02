import { INPUT_DATE_FORMAT } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { describe, expect, it, vi } from "vitest";
import ExportForm from "./ExportForm";
import type {
  ExportFieldGroup,
  ExportFormValues,
} from "../../types/ExportForm";

const FIELD_GROUPS: readonly ExportFieldGroup[] = [
  {
    title: "Primary Identity",
    key: "primary-identity",
    fields: [
      { id: "hostname", label: "Hostname" },
      { id: "title", label: "Instance name" },
    ],
  },
  {
    title: "Compliance",
    key: "compliance",
    fields: [
      { id: "securely_patched", label: "Securely patched" },
      { id: "time_to_patch_days", label: "Time to patch (days)" },
    ],
  },
];

const INITIAL_VALUES: ExportFormValues = {
  name: "",
  selectedFieldIds: [],
  retainUntil: moment().add(3, "years").format(INPUT_DATE_FORMAT),
};

const renderForm = (
  overrides: Partial<{
    initialValues: ExportFormValues;
    onGenerate: (args: {
      values: ExportFormValues;
      fieldsToExport: { id: string; label: string; groupTitle?: string }[];
    }) => Promise<void>;
  }> = {},
) => {
  const onGenerate =
    overrides.onGenerate ?? vi.fn().mockResolvedValue(undefined);

  renderWithProviders(
    <ExportForm
      fieldGroups={FIELD_GROUPS}
      initialValues={overrides.initialValues ?? INITIAL_VALUES}
      isSubmitting={false}
      onGenerate={onGenerate}
    />,
  );

  return { onGenerate };
};

const openAttributeGroup = async (
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp,
) => {
  await user.click(screen.getByRole("tab", { name }));
};

describe("ExportForm", () => {
  it("keeps Next disabled until an export name and at least one attribute are selected", async () => {
    const user = userEvent.setup();
    renderForm();

    const nextButton = screen.getByRole("button", { name: "Next" });

    expect(nextButton).toHaveAttribute("aria-disabled", "true");

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My export",
    );

    expect(nextButton).toHaveAttribute("aria-disabled", "true");

    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));

    expect(nextButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("filters attributes by search text and shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();
    renderForm();

    const searchInput = screen.getByRole("searchbox", {
      name: "Search attributes",
    });

    await user.type(searchInput, "securely");

    expect(
      screen.getByRole("tab", { name: /compliance/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /primary identity/i }),
    ).not.toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, "does not exist");

    expect(
      screen.getByText("No attributes match your search."),
    ).toBeInTheDocument();
  });

  it("auto-expands matching groups so fields are visible without clicking the group header", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(
      screen.queryByRole("checkbox", { name: "Hostname" }),
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: "Search attributes" }),
      "host",
    );

    expect(
      screen.getByRole("checkbox", { name: "Hostname" }),
    ).toBeInTheDocument();
  });

  it("auto-expands groups matched by group title so all their fields are visible", async () => {
    const user = userEvent.setup();
    renderForm();

    // Group-title matching was removed; only field labels are matched.
    // Searching a group name that doesn't appear in any field label yields no results.
    await user.type(
      screen.getByRole("searchbox", { name: "Search attributes" }),
      "compliance",
    );

    expect(
      screen.getByText("No attributes match your search."),
    ).toBeInTheDocument();
  });

  it("disables group select-all checkbox while search is active", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("searchbox", { name: "Search attributes" }),
      "secure",
    );

    expect(
      screen.getByRole("checkbox", { name: /agent logs/i }),
    ).toBeDisabled();
  });

  it("re-enables group select-all checkbox when search is cleared", async () => {
    const user = userEvent.setup();
    renderForm();

    const searchInput = screen.getByRole("searchbox", {
      name: "Search attributes",
    });
    await user.type(searchInput, "securely");
    await user.clear(searchInput);

    await openAttributeGroup(user, /compliance/i);
    expect(
      screen.getByRole("checkbox", { name: /compliance select all/i }),
    ).not.toBeDisabled();
  });

  it("sorts search results: starts-with matches appear before contains matches", async () => {
    const user = userEvent.setup();
    renderForm();

    // "name" matches "Instance name" (contains) from Primary Identity
    // and "Export name" is the form field — only "Instance name" is an attribute.
    // Use "patch" which matches two fields in Compliance at equal rank (both contain).
    // Use "host" which matches "Hostname" with starts-with rank in Primary Identity.
    await user.type(
      screen.getByRole("searchbox", { name: "Search attributes" }),
      "host",
    );

    expect(
      screen.getByRole("checkbox", { name: "Hostname" }),
    ).toBeInTheDocument();
    // Compliance group has no matching fields → not rendered.
    expect(
      screen.queryByRole("tab", { name: /compliance/i }),
    ).not.toBeInTheDocument();
  });

  it("selects and deselects all fields in a group from the group checkbox", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn().mockResolvedValue(undefined);

    renderForm({ onGenerate });

    const exportName = screen.getByRole("textbox", { name: "Export name" });
    const nextButton = screen.getByRole("button", { name: "Next" });
    const groupSelectAll = screen.getByRole("checkbox", {
      name: "Primary Identity",
    });

    await user.type(exportName, "Group selection export");
    await user.click(groupSelectAll);

    expect(nextButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(nextButton);
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(onGenerate).toHaveBeenCalledWith({
        values: expect.objectContaining({
          selectedFieldIds: ["hostname", "title"],
        }),
        fieldsToExport: [
          { id: "hostname", label: "Hostname", groupTitle: "Primary Identity" },
          {
            id: "title",
            label: "Instance name",
            groupTitle: "Primary Identity",
          },
        ],
      });
    });

    await user.click(screen.getByRole("button", { name: "Back" }));
    await user.click(
      screen.getByRole("checkbox", { name: "Primary Identity" }),
    );

    expect(nextButton).toHaveAttribute("aria-disabled", "true");
  });

  it("moves to the reorder step on the first submit and returns to step 0 with Back", async () => {
    const user = userEvent.setup();
    const { onGenerate } = renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Ordered export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onGenerate).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Generate TSV" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Export name" }),
    ).toBeInTheDocument();
  });

  it("submits selected fields and form values on the second step", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn().mockResolvedValue(undefined);

    renderForm({ onGenerate });

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Compliance export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));
    await openAttributeGroup(user, /compliance/i);
    await user.click(
      screen.getByRole("checkbox", { name: "Securely patched" }),
    );

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(onGenerate).toHaveBeenCalledWith({
        values: expect.objectContaining({
          name: "Compliance export",
          selectedFieldIds: ["hostname", "securely_patched"],
          retainUntil: INITIAL_VALUES.retainUntil,
        }),
        fieldsToExport: [
          { id: "hostname", label: "Hostname", groupTitle: "Primary Identity" },
          {
            id: "securely_patched",
            label: "Securely patched",
            groupTitle: "Compliance",
          },
        ],
      });
    });
  });

  it("shows group badges and reset button on step 2", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Badge test",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));
    await openAttributeGroup(user, /compliance/i);
    await user.click(
      screen.getByRole("checkbox", { name: "Securely patched" }),
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Primary Identity")).toBeInTheDocument();
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset order/i }),
    ).toBeInTheDocument();
  });

  it("reset order restores group-declaration sequence after manual reorder", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn().mockResolvedValue(undefined);

    renderForm({ onGenerate });

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Reset test",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));
    await user.click(screen.getByRole("checkbox", { name: "Instance name" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    await user.click(
      screen.getByRole("button", { name: /move hostname down/i }),
    );

    await user.click(screen.getByRole("button", { name: /reset order/i }));

    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(onGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldsToExport: [
            expect.objectContaining({ id: "hostname" }),
            expect.objectContaining({ id: "title" }),
          ],
        }),
      );
    });
  });
});
