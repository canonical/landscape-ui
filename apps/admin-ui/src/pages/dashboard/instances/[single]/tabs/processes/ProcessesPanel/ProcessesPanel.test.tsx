import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { processes } from "@/tests/mocks/process";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import ProcessesPanel from "./ProcessesPanel";
import moment from "moment/moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";

describe("ProcessesPanel", () => {
  it("renders empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<ProcessesPanel />);

    const emptyStateTitle = await screen.findByText("No processes running");
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("renders filtered list of processes", async () => {
    renderWithProviders(<ProcessesPanel />);

    for (const process of processes) {
      const listProcess = await screen.findByRole("row", {
        name: `Select process ${process.name} ${process.name} ${process.state} ${process.vm_size} ${(100 * process.cpu_utilisation).toFixed(1)}% ${process.pid} ${moment(process.start_time).format(DISPLAY_DATE_TIME_FORMAT)} ${process.gid}`,
      });
      expect(listProcess).toBeInTheDocument();
    }
    const searchBox = await screen.findByRole("searchbox");
    await userEvent.type(searchBox, `${processes[0].name}{enter}`);
    const processFound = await screen.findByRole("row", {
      name: `Select process ${processes[0].name} ${processes[0].name} ${processes[0].state} ${processes[0].vm_size} ${(100 * processes[0].cpu_utilisation).toFixed(1)}% ${processes[0].pid} ${moment(processes[0].start_time).format(DISPLAY_DATE_TIME_FORMAT)} ${processes[0].gid}`,
    });
    const processRemoved = screen.queryByRole("row", {
      name: `Select process ${processes[5].name} ${processes[5].name} ${processes[5].state} ${processes[5].vm_size} ${(100 * processes[5].cpu_utilisation).toFixed(1)}% ${processes[5].pid} ${moment(processes[5].start_time).format(DISPLAY_DATE_TIME_FORMAT)} ${processes[5].gid}`,
    });
    expect(processFound).toBeInTheDocument();
    expect(processRemoved).not.toBeInTheDocument();
  });
});
