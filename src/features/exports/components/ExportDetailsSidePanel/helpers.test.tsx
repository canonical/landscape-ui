import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { completedExportJob, failedExportJob } from "@/tests/mocks/exports";
import { getFilterValue } from "./helpers";

describe("getFilterValue", () => {
  it("returns null when job has no query", () => {
    expect(getFilterValue(failedExportJob)).toBeNull();
  });

  it("returns null when job has empty query", () => {
    const job = { ...completedExportJob, query: "  " };
    expect(getFilterValue(job)).toBeNull();
  });

  it("returns JSX with the query code", () => {
    const result = getFilterValue(completedExportJob);
    expect(result).not.toBeNull();
    const { container } = render(<>{result}</>);
    expect(container.textContent).toContain("id:1 OR id:2");
  });
});
