import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import SortableFieldList from "./SortableFieldList";
import type { ExportField } from "../../types/ExportForm";

const FIELDS: ExportField[] = [
  { id: "hostname", label: "Hostname", groupTitle: "Primary Identity" },
  { id: "status", label: "Status", groupTitle: "Primary Identity" },
  {
    id: "securely_patched",
    label: "Securely patched",
    groupTitle: "Compliance",
  },
];

describe("SortableFieldList", () => {
  it("renders all field labels", () => {
    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={vi.fn()} />,
    );

    expect(screen.getByText("Hostname")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Securely patched")).toBeInTheDocument();
  });

  it("renders group badges for each field", () => {
    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={vi.fn()} />,
    );

    const primaryBadges = screen.getAllByText("Primary Identity");
    expect(primaryBadges).toHaveLength(2);
    expect(screen.getByText("Compliance")).toBeInTheDocument();
  });

  it("does not render a group badge when groupTitle is absent", () => {
    const fields: ExportField[] = [{ id: "hostname", label: "Hostname" }];

    renderWithProviders(
      <SortableFieldList fields={fields} onOrderChange={vi.fn()} />,
    );

    expect(screen.queryByText("Primary Identity")).not.toBeInTheDocument();
  });

  it("shows the Reset order button", () => {
    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: /reset order/i }),
    ).toBeInTheDocument();
  });

  it("calls onOrderChange with original fields when Reset is clicked", async () => {
    const user = userEvent.setup();
    const onOrderChange = vi.fn();

    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={onOrderChange} />,
    );

    await user.click(
      screen.getByRole("button", { name: /move hostname down/i }),
    );
    onOrderChange.mockClear();

    await user.click(screen.getByRole("button", { name: /reset order/i }));

    expect(onOrderChange).toHaveBeenCalledWith(FIELDS);
  });

  it("restores the displayed row order after Reset is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={vi.fn()} />,
    );

    await user.click(
      screen.getByRole("button", { name: /move hostname down/i }),
    );

    expect(
      screen.getByRole("spinbutton", { name: /order for status/i }),
    ).toHaveValue(1);
    expect(
      screen.getByRole("spinbutton", { name: /order for hostname/i }),
    ).toHaveValue(2);

    await user.click(screen.getByRole("button", { name: /reset order/i }));

    expect(
      screen.getByRole("spinbutton", { name: /order for hostname/i }),
    ).toHaveValue(1);
    expect(
      screen.getByRole("spinbutton", { name: /order for status/i }),
    ).toHaveValue(2);
  });

  it("moves a field up using the arrow button", async () => {
    const user = userEvent.setup();
    const onOrderChange = vi.fn();

    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={onOrderChange} />,
    );

    await user.click(screen.getByRole("button", { name: /move status up/i }));

    expect(onOrderChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: "status" }),
      expect.objectContaining({ id: "hostname" }),
      expect.objectContaining({ id: "securely_patched" }),
    ]);
  });

  it("moves a field down using the arrow button", async () => {
    const user = userEvent.setup();
    const onOrderChange = vi.fn();

    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={onOrderChange} />,
    );

    await user.click(
      screen.getByRole("button", { name: /move hostname down/i }),
    );

    expect(onOrderChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: "status" }),
      expect.objectContaining({ id: "hostname" }),
      expect.objectContaining({ id: "securely_patched" }),
    ]);
  });

  it("disables the Up button for the first row and the Down button for the last row", () => {
    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: /move hostname up/i }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByRole("button", { name: /move securely patched down/i }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("reset restores original order even when parent state is kept in sync with each move", async () => {
    const user = userEvent.setup();

    // Mirror ExportForm's usage: parent updates fields on every onOrderChange call
    const ControlledWrapper = () => {
      const [fields, setFields] = useState<ExportField[]>(FIELDS);
      return <SortableFieldList fields={fields} onOrderChange={setFields} />;
    };

    renderWithProviders(<ControlledWrapper />);

    await user.click(
      screen.getByRole("button", { name: /move hostname down/i }),
    );

    expect(
      screen.getByRole("spinbutton", { name: /order for status/i }),
    ).toHaveValue(1);

    await user.click(screen.getByRole("button", { name: /reset order/i }));

    expect(
      screen.getByRole("spinbutton", { name: /order for hostname/i }),
    ).toHaveValue(1);
    expect(
      screen.getByRole("spinbutton", { name: /order for status/i }),
    ).toHaveValue(2);
  });

  it("renders the reorder instructions", () => {
    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={vi.fn()} />,
    );

    expect(
      screen.getByText(/review and reorder the columns for your export/i),
    ).toBeInTheDocument();
  });

  it("moves a field to a specific position via the order input", async () => {
    const user = userEvent.setup();
    const onOrderChange = vi.fn();

    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={onOrderChange} />,
    );

    const hostnameInput = screen.getByRole("spinbutton", {
      name: /order for hostname/i,
    });
    await user.clear(hostnameInput);
    await user.type(hostnameInput, "3");
    await user.keyboard("{Enter}");

    expect(onOrderChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: "status" }),
      expect.objectContaining({ id: "securely_patched" }),
      expect.objectContaining({ id: "hostname" }),
    ]);
  });

  it("ignores an out-of-range value entered in the order input", async () => {
    const user = userEvent.setup();
    const onOrderChange = vi.fn();

    renderWithProviders(
      <SortableFieldList fields={FIELDS} onOrderChange={onOrderChange} />,
    );

    const hostnameInput = screen.getByRole("spinbutton", {
      name: /order for hostname/i,
    });
    await user.clear(hostnameInput);
    await user.type(hostnameInput, "99");
    await user.keyboard("{Enter}");

    expect(onOrderChange).not.toHaveBeenCalled();
  });
});
