export interface CVE extends Record<string, unknown> {
  cve: string;
  cve_link: string;
}

export interface UsnPackage extends Record<string, unknown> {
  computer_ids: number[];
  current_id: number;
  current_version: string;
  name: string;
  new_version: string;
  summary: string;
}

export interface Usn extends Record<string, unknown> {
  computers_count: number;
  cves: CVE[];
  date: string;
  info: string;
  packages: UsnPackage[];
  usn: string;
  usn_link: string;
}
