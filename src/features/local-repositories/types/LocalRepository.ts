export interface Local extends Record<string, unknown> {
  name: string;
  localId: string;
  displayName: string;
  comment?: string;
  defaultDistribution: string;
  defaultComponent: string;
}

export interface LocalPackage extends Record<string, unknown> {
  name: string;
}
