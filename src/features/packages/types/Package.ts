export interface PackageComputers {
  count: number;
}

export class Package implements Record<string, unknown> {
  static nextId = 1;

  id: number;
  name: string;
  summary: string;
  version: string;
  computers: PackageComputers;
  [x: string]: unknown;

  constructor({
    id,
    name,
    summary,
    version,
    computerCount,
  }: {
    name: string;
    version: string;
    computerCount: number;
    id?: number;
    summary?: string;
  }) {
    this.id = id ?? Package.nextId++;
    this.name = name;
    this.summary = summary ?? "";
    this.version = version;
    this.computers = { count: computerCount };
  }
}

export type PackageWithVersions = [Package, number[]];
