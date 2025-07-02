export interface Process extends Record<string, unknown> {
  computer_id: number;
  cpu_utilisation: number;
  gid: number;
  id: number;
  name: string;
  pid: number;
  start_time: string;
  state: string;
  vm_size: number;
}
