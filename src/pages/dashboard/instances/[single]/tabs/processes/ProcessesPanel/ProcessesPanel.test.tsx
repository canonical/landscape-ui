import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { processes } from "@/tests/mocks/process";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import ProcessesPanel from "./ProcessesPanel";

describe("ProcessesPanel", () => {
  it("renders empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<ProcessesPanel />);

    const emptyStateTitle = await screen.findByText("No processes running");
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("renders filtered list of processes", async () => {
    renderWithProviders(<ProcessesPanel />);

    for (let i = 0; i < processes.length; i++) {
      const chosenProcess = processes[i];
      const process = await screen.findByRole("row", {
        name: `Select process ${chosenProcess.name} ${chosenProcess.name} ${chosenProcess.state} ${chosenProcess.vm_size} ${(100 * chosenProcess.cpu_utilisation).toFixed(1)}% ${chosenProcess.pid} ${chosenProcess.start_time} ${chosenProcess.gid}`,
      });
      expect(process).toBeInTheDocument();
    }
    const searchBox = await screen.findByRole("searchbox");
    await userEvent.type(searchBox, `${processes[0].name}{enter}`);
    const processFound = await screen.findByRole("row", {
      name: `Select process ${processes[0].name} ${processes[0].name} ${processes[0].state} ${processes[0].vm_size} ${(100 * processes[0].cpu_utilisation).toFixed(1)}% ${processes[0].pid} ${processes[0].start_time} ${processes[0].gid}`,
    });
    const processRemoved = screen.queryByRole("row", {
      name: `Select process ${processes[5].name} ${processes[5].name} ${processes[5].state} ${processes[5].vm_size} ${(100 * processes[5].cpu_utilisation).toFixed(1)}% ${processes[5].pid} ${processes[5].start_time} ${processes[5].gid}`,
    });
    expect(processFound).toBeInTheDocument();
    expect(processRemoved).not.toBeInTheDocument();
  });
});
