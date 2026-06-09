import server from "@/tests/server";
import useSidePanel from "@/hooks/useSidePanel";
import useNotify from "@/hooks/useNotify";
import { API_URL } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import InstancesExportForm from "./InstancesExportForm";

const closeSidePanel = vi.fn();
const notify = {
  clear: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  success: vi.fn(),
  notification: null,
};

vi.mock("@/hooks/useSidePanel");
vi.mock("@/hooks/useNotify");

describe("InstancesExportForm", () => {
  beforeEach(() => {
    closeSidePanel.mockReset();
    vi.mocked(useSidePanel, { partial: true }).mockReturnValue({
      closeSidePanel,
    });
    vi.mocked(useNotify).mockReturnValue({
      notify,
      sidePanel: {
        open: false,
        setOpen: vi.fn(),
      },
    });
    notify.info.mockReset();
    notify.success.mockReset();
    notify.error.mockReset();
    notify.clear.mockReset();
  });

  it("shows step 1 with attribute groups in accordions", () => {
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
    expect(screen.getByLabelText("Export name")).toBeInTheDocument();
    expect(screen.getByLabelText("Search attributes")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /primary identity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", {
        name: /granular metadata & deep diagnostics/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Annotations")).toBeInTheDocument();
  });

  it("disables Next button when no fields are selected", () => {
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

    expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    expect(screen.getByLabelText("Export name")).toHaveValue("");
  });

  it("filters attributes in step 1", async () => {
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

    await user.type(screen.getByLabelText("Search attributes"), "host");

    expect(screen.getByLabelText("Hostname")).toBeInTheDocument();
    expect(screen.queryByLabelText("Instance name")).not.toBeInTheDocument();
  });

  it("does not match parent group titles when filtering attributes", async () => {
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

    await user.type(screen.getByLabelText("Search attributes"), "primary");

    expect(
      screen.getByText("No attributes match your search."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /primary identity/i }),
    ).not.toBeInTheDocument();
  });

  it("shows attribute validation with error styling", async () => {
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

    await user.type(screen.getByLabelText("Export name"), "Weekly export");
    await user.click(screen.getByLabelText("Instance name"));
    await user.click(screen.getByLabelText("Instance name"));

    expect(screen.getByText("Select at least one attribute")).toHaveClass(
      "p-form-validation__message",
    );
  });

  it("moves to step 2 showing reorder table when Next is clicked", async () => {
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

    await user.type(screen.getByLabelText("Export name"), "Weekly export");
    await user.click(screen.getByLabelText("Instance name"));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(
      screen.getByText(/review and reorder the columns/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Order for Instance name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("allows going back from step 2 to step 1", async () => {
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

    await user.type(screen.getByLabelText("Export name"), "Weekly export");
    await user.click(screen.getByLabelText("Instance name"));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(
      screen.getByRole("button", { name: "Next" }),
    ).toBeInTheDocument();
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

    await user.type(screen.getByLabelText("Export name"), "Weekly export");
    await user.click(screen.getByLabelText("Instance name"));
    await user.click(screen.getByLabelText("Hostname"));
    await user.click(screen.getByRole("button", { name: "Next" }));

    const orderInput = screen.getByLabelText("Order for Hostname");

    await user.click(orderInput);
    await user.keyboard("{Backspace}1");

    expect(orderInput).toHaveFocus();
    expect(orderInput).toHaveValue(1);
  });

  it("queues an export, closes the side panel, and shows a toast", async () => {
    const user = userEvent.setup();
    let capturedBody: unknown = null;
    server.use(
      http.post(`${API_URL}computers/export/csv`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json(
          {
            id: "job-1",
            name: "Weekly export",
            filename: "instances-export.tsv",
            instanceCount: 8,
            attributeLabels: ["Instance name"],
            selectedFieldIds: ["title"],
            createdAt: "2026-06-03T12:10:00.000Z",
            status: "processing",
            progress: 0,
            downloadReady: false,
          },
          { status: 201 },
        );
      }),
    );

    renderWithProviders(
      <InstancesExportForm
        exportParams={{
          query: "name:prod",
          archived_only: false,
          wsl_children: false,
          wsl_parents: false,
        }}
        instanceCount={8}
      />,
    );

    await user.type(screen.getByLabelText("Export name"), "Weekly export");
    await user.click(screen.getByLabelText("Instance name"));
    await user.click(screen.getByLabelText("Annotations"));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    expect(closeSidePanel).toHaveBeenCalled();
    expect(notify.info).toHaveBeenCalledWith(
      expect.objectContaining({ title: "TSV export in progress" }),
    );
    expect(capturedBody).toMatchObject({
      name: "Weekly export",
      query: "name:prod",
      selected_field_ids: ["title", "annotations"],
    });
  });
});