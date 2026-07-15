import type { CVE } from "./CVE";
import type { USN } from "./USN";

export interface PackageComputers {
  count: number;
}

export class Package {
  static nextId = 1;

  id: number;
  name: string;
  summary: string;
  version: string;
  computers: PackageComputers;
  usn: USN | null = null;
  cves: CVE[];

  constructor({
    id,
    name,
    summary,
    version,
    computerCount,
    usn,
    cves,
  }: {
    name: string;
    version: string;
    computerCount: number;
    id?: number;
    summary?: string;
    usn?: USN;
    cves?: CVE[];
  }) {
    this.id = id ?? Package.nextId++;
    this.name = name;
    this.summary = summary ?? "";
    this.version = version;
    this.computers = { count: computerCount };
    this.usn = usn ?? null;
    this.cves = cves ?? [];
  }
}
