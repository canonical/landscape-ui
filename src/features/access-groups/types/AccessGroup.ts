export interface AccessGroup {
  children: string;
  name: string;
  parent: string;
  title: string;
}

export interface AccessGroupWithInstancesCount
  extends AccessGroup, Record<string, unknown> {
  instancesCount: number;
}
