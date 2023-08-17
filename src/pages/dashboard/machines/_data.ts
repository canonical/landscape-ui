import { Process } from "../../../types/Process";

// Mock data to populate the table
export const mockProcesses: Process[] = [
  {
    pid: 1000,
    gid: 1,
    uid: 1,
    name: "process1",
    state: 1,
    start_time: "2021-01-01 00:00:00",
    vm_size: 10240,
    cpu_utilization: 0.1,
    computer_id: 1,
  },
  {
    pid: 1001,
    gid: 1,
    uid: 1,
    name: "process2",
    state: 10,
    start_time: "2022-05-07 00:00:00",
    vm_size: 10240,
    cpu_utilization: 0.2,
    computer_id: 1,
  },
  {
    pid: 1002,
    gid: 2,
    uid: 2,
    name: "process3",
    state: 8,
    start_time: "2023-10-03 00:00:00",
    vm_size: 5120,
    cpu_utilization: 0.18,
    computer_id: 1,
  },
];
