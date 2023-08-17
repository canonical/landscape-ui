export interface Process {
  computer_id: number;
  pid: number;
  uid: number;
  gid: number;
  name: string;
  state: number;
  start_time: string;
  vm_size: number;
  cpu_utilization: number;
}
