import { describe, expect, it } from "vitest";
import type { ComputerPackageSearchGroupedResult } from "./types";
import { mapGroupedResultToInstancePackage } from "./helpers";

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

  it("maps a security-marked result with no candidate to status 'security'", () => {
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
      status: "security",
    });
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
