import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import GroupHeader from "./GroupHeader";
import { compliantInstanceChild, instanceChildren } from "@/tests/mocks/wsl";
import type { InstanceChild } from "@/types/Instance";

describe("GroupHeader", () => {
  const user = userEvent.setup();

  it("renders the label with instance count", () => {
    render(
      <GroupHeader
        label="Ubuntu 22.04"
        wslInstances={instanceChildren}
        selectedWslInstances={[]}
        setSelectedWslInstances={vi.fn()}
      />,
    );

    expect(
      screen.getByText(`Ubuntu 22.04 (${instanceChildren.length})`),
    ).toBeInTheDocument();
  });

  it("renders checkbox as unchecked when no instances are selected", () => {
    render(
      <GroupHeader
        label="Ubuntu 22.04"
        wslInstances={[compliantInstanceChild]}
        selectedWslInstances={[]}
        setSelectedWslInstances={vi.fn()}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders checkbox as checked when all non-pending instances are selected", () => {
    render(
      <GroupHeader
        label="Ubuntu 22.04"
        wslInstances={[compliantInstanceChild]}
        selectedWslInstances={[compliantInstanceChild]}
        setSelectedWslInstances={vi.fn()}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("calls setSelectedWslInstances with added instance when checkbox is checked", async () => {
    const setSelected = vi.fn();

    render(
      <GroupHeader
        label="Ubuntu 22.04"
        wslInstances={[compliantInstanceChild]}
        selectedWslInstances={[]}
        setSelectedWslInstances={setSelected}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(setSelected).toHaveBeenCalledWith([compliantInstanceChild]);
  });

  it("calls setSelectedWslInstances with removed instance when checkbox is unchecked", async () => {
    const setSelected = vi.fn();

    render(
      <GroupHeader
        label="Ubuntu 22.04"
        wslInstances={[compliantInstanceChild]}
        selectedWslInstances={[compliantInstanceChild]}
        setSelectedWslInstances={setSelected}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(setSelected).toHaveBeenCalledWith([]);
  });

  it("calls setSelectedWslInstances correctly when checking from indeterminate state", async () => {
    const setSelected = vi.fn();

    const secondCompliant: InstanceChild = {
      ...compliantInstanceChild,
      name: "second-instance",
      computer_id: 8,
    };

    render(
      <GroupHeader
        label="Ubuntu 22.04"
        wslInstances={[compliantInstanceChild, secondCompliant]}
        selectedWslInstances={[compliantInstanceChild]}
        setSelectedWslInstances={setSelected}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(setSelected).toHaveBeenCalledWith(
      expect.arrayContaining([compliantInstanceChild, secondCompliant]),
    );
  });

  it("shows indeterminate state when some instances are selected", () => {
    const secondCompliant: InstanceChild = {
      ...compliantInstanceChild,
      name: "second-instance",
      computer_id: 8,
    };

    render(
      <GroupHeader
        label="Ubuntu 22.04"
        wslInstances={[compliantInstanceChild, secondCompliant]}
        selectedWslInstances={[compliantInstanceChild]}
        setSelectedWslInstances={vi.fn()}
      />,
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it("disables checkbox when all instances are pending", () => {
    const pendingInstance: InstanceChild = {
      ...compliantInstanceChild,
      compliance: "pending",
    };

    render(
      <GroupHeader
        label="Ubuntu 22.04"
        wslInstances={[pendingInstance]}
        selectedWslInstances={[]}
        setSelectedWslInstances={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
