import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViewUSGProfileDetailsBlock from "./ViewUSGProfileDetailsBlock";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("ViewUSGProfileDetailsBlock", () => {
  it.each([
    ["disa_stig", "audit", null, "DISA-STIG", "Audit only", NO_DATA_TEXT],
    [
      "cis_level1_workstation",
      "audit-fix",
      "root/",
      "CIS Level 1 Workstation",
      "Fix and audit",
      "tailoring-file.xml",
    ],
    [
      "cis_level2_server",
      "audit-fix-restart",
      "root/file",
      "CIS Level 2 Server",
      "Fix, restart, audit",
      "file",
    ],
  ] as const)(
    "renders benchmark, tailoring and mode labels",
    (
      benchmark,
      mode,
      tailoringFile,
      expectedBenchmark,
      expectedMode,
      expectedTailoringFile,
    ) => {
      renderWithProviders(
        <ViewUSGProfileDetailsBlock
          profile={{
            ...usgProfiles[0],
            benchmark,
            mode,
            tailoring_file_uri: tailoringFile,
          }}
        />,
      );

      expect(screen.getByText("Benchmark")).toBeInTheDocument();
      expect(screen.getByText(expectedBenchmark)).toBeInTheDocument();
      expect(screen.getByText("Tailoring file")).toBeInTheDocument();
      expect(screen.getByText(expectedTailoringFile)).toBeInTheDocument();
      expect(screen.getByText("Mode")).toBeInTheDocument();
      expect(screen.getByText(expectedMode)).toBeInTheDocument();
    },
  );
});
