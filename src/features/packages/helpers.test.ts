import { describe, expect, it } from "vitest";
import type { ComputerPackageSearchGroupedResult } from "./types";
import { mapGroupedResultToInstancePackage } from "./helpers";
import { getPackageStatusInfo } from "./components/PackageList/helpers";

describe("mapGroupedResultToInstancePackage", () => {
  it("maps a package with a security upgrade candidate to status 'security'", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "curl",
      summary: "command line tool for transferring data with URL syntax",
      installed_version: "7.68.0-1ubuntu2.18",
      installed_id: 101,
      held: false,
      security: true,
      installation_candidates: [
        {
          id: 201,
          version: "7.68.0-1ubuntu2.19",
          upgrade: true,
          security: false,
        },
        {
          id: 202,
          version: "7.68.0-1ubuntu2.20",
          upgrade: true,
          security: true,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result).toEqual({
      id: 101,
      name: "curl",
      summary: "command line tool for transferring data with URL syntax",
      current_version: "7.68.0-1ubuntu2.18",
      available_version: "7.68.0-1ubuntu2.20",
      status: "security",
    });
  });

  it("maps a package with regular upgrade candidates to status 'installed'", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "git",
      summary: "fast, scalable, distributed revision control system",
      installed_version: "1:2.25.1-1ubuntu3",
      installed_id: 102,
      held: false,
      security: false,
      installation_candidates: [
        {
          id: 203,
          version: "1:2.25.1-1ubuntu3.11",
          upgrade: true,
          security: false,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result).toEqual({
      id: 102,
      name: "git",
      summary: "fast, scalable, distributed revision control system",
      current_version: "1:2.25.1-1ubuntu3",
      available_version: "1:2.25.1-1ubuntu3.11",
      status: "installed",
    });
  });

  it("maps a held package to status 'held' even when upgrade candidates exist", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "base-files",
      summary: "Debian base system miscellaneous files",
      installed_version: "11ubuntu5",
      installed_id: 103,
      held: true,
      security: false,
      installation_candidates: [
        {
          id: 204,
          version: "11ubuntu5.7",
          upgrade: true,
          security: false,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result).toEqual({
      id: 103,
      name: "base-files",
      summary: "Debian base system miscellaneous files",
      current_version: "11ubuntu5",
      available_version: "11ubuntu5.7",
      status: "held",
    });
  });

  it("maps a security-marked result with no candidate to status 'installed'", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "openssl",
      summary: "Secure Sockets Layer toolkit",
      installed_version: "1.1.1f-1ubuntu2",
      installed_id: 104,
      held: false,
      security: true,
      installation_candidates: [],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result).toEqual({
      id: 104,
      name: "openssl",
      summary: "Secure Sockets Layer toolkit",
      current_version: "1.1.1f-1ubuntu2",
      available_version: null,
      status: "installed",
    });
  });

  it("maps a candidate that is both upgrade and security to status 'security' even when the group flag is false", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "libssl3",
      summary: "Secure Sockets Layer toolkit - shared libraries",
      installed_version: "3.0.1",
      installed_id: 106,
      held: false,
      security: false,
      installation_candidates: [
        {
          id: 207,
          version: "3.0.2",
          upgrade: true,
          security: true,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result.status).toBe("security");
    expect(result.available_version).toBe("3.0.2");
  });

  it("ignores the group security flag when the upgrade candidate is not a security upgrade", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "curl",
      summary: "command line tool for transferring data with URL syntax",
      installed_version: "7.81.0-1ubuntu1.15",
      installed_id: 109,
      held: false,
      security: true,
      installation_candidates: [
        {
          id: 211,
          version: "7.81.0-1ubuntu1.16",
          upgrade: true,
          security: false,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result.status).toBe("installed");
    expect(result.available_version).toBe("7.81.0-1ubuntu1.16");
  });

  it("does not report a security upgrade for a security candidate on a package that is not installed", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "nginx",
      summary: "small, powerful, scalable web/proxy server",
      installed_version: null,
      installed_id: null,
      held: false,
      security: false,
      installation_candidates: [
        {
          id: 206,
          version: "1.18.0-6ubuntu14.4",
          upgrade: false,
          security: true,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result.status).toBe("available");
    expect(result.available_version).toBe("1.18.0-6ubuntu14.4");
  });

  it("does not report a security upgrade when the installed version is higher than the security candidate", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "zlib1g",
      summary: "compression library - runtime",
      installed_version: "1:1.2.13",
      installed_id: 107,
      held: false,
      security: false,
      installation_candidates: [
        {
          id: 208,
          version: "1:1.2.11",
          upgrade: false,
          security: true,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result.status).toBe("installed");
    expect(result.available_version).toBeNull();
  });

  it("prefers a regular upgrade over a security candidate that is not an upgrade", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "bash",
      summary: "GNU Bourne Again SHell",
      installed_version: "5.1-2",
      installed_id: 108,
      held: false,
      security: false,
      installation_candidates: [
        {
          id: 209,
          version: "5.0-1",
          upgrade: false,
          security: true,
        },
        {
          id: 210,
          version: "5.1-3",
          upgrade: true,
          security: false,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result.status).toBe("installed");
    expect(result.available_version).toBe("5.1-3");
    expect(getPackageStatusInfo(result).label).toBe("Regular upgrade");
  });

  it("maps an available-only (not installed) package to status 'available' with a synthetic id", () => {
    const input: ComputerPackageSearchGroupedResult = {
      name: "htop",
      summary: null,
      installed_version: null,
      installed_id: null,
      held: false,
      security: false,
      installation_candidates: [
        {
          id: 205,
          version: "3.0.5-7build1",
          upgrade: false,
          security: false,
        },
      ],
    };

    const result = mapGroupedResultToInstancePackage(input);

    expect(result.name).toBe("htop");
    expect(result.summary).toBe("");
    expect(result.current_version).toBeNull();
    expect(result.available_version).toBe("3.0.5-7build1");
    expect(result.status).toBe("available");
    expect(result.id).toBe(input.installation_candidates[0]?.id);
  });
});
