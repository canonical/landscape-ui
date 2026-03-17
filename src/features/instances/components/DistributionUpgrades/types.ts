export interface InstanceModalRow extends Record<string, unknown> {
  instanceId: number;
  instanceTitle: string;
  currentDistribution: string;
  targetDistribution: string;
  reason?: string;
}

export interface TableRow extends Record<string, unknown> {
  instances: InstanceModalRow[];
  count: number;
  text: string;
  subRows?: TableRow[];
  iconClass?: string;
  distributionKey?: string;
}
