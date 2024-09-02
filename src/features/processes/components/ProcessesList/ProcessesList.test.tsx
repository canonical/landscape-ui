import { processes } from "@/tests/mocks/process";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import ProcessesList from "./ProcessesList";

const processIds = processes.map((process) => process.pid);

const props = {
  processes: processes,
  isLoading: false,
  selectedPids: [],
  setSelectedPids: vi.fn(),
};

describe("ProcessesList", () => {
  beforeEach(() => {
    renderWithProviders(<ProcessesList {...props} />);
  });

  it("should select all processes when clicking ToggleAll checkbox", async () => {
    const toggleAllCheckbox = await screen.findByRole("checkbox", {
      name: /toggle all/i,
    });
    await userEvent.click(toggleAllCheckbox);

    expect(props.setSelectedPids).toHaveBeenCalledWith(processIds);
  });

  it("should select process when clicking on its row checkbox", async () => {
    const chosenProcess = processes[0];
    const row = screen.getByRole("row", {
      name: `Select process ${chosenProcess.name} ${chosenProcess.name} ${chosenProcess.state} ${chosenProcess.vm_size} ${(100 * chosenProcess.cpu_utilisation).toFixed(1)}% ${chosenProcess.pid} ${chosenProcess.start_time} ${chosenProcess.gid}`,
    });
    const processCheckbox = await within(row).findByRole("checkbox", {
      name: `Select process ${chosenProcess.name}`,
    });
    await userEvent.click(processCheckbox);

    expect(props.setSelectedPids).toHaveBeenCalledWith([chosenProcess.pid]);
  });
});
