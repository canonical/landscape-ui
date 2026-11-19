import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it } from "vitest";
import type { ComputerHealthHistory } from "../../types";
import HealthHistory from "./HealthHistory";

const COMPUTER_ID = 2;

const respondWith = (history: ComputerHealthHistory) => {
  server.use(
    http.get(`${API_URL}computers/:computer_id/health/history`, () =>
      HttpResponse.json(history),
    ),
  );
};

type Row = ComputerHealthHistory["results"][number];

const row = (fields: Pick<Row, "date" | "score"> & Partial<Row>): Row => ({
  band: fields.score === null ? null : "warning",
  critical_factor_count: 0,
  rules_version: 7,
  factors: [],
  ...fields,
});

const REBOOT = { rule_key: "reboot_required", count: 1, points: 10 };
const USN_HIGH = { rule_key: "usn.high", count: 2, points: 40 };

afterEach(() => {
  setEndpointStatus("default");
});

describe("HealthHistory", () => {
  it("lists each change, newest first, with the rules behind it", async () => {
    respondWith({
      baseline: row({ date: "2026-07-28", score: 90, factors: [REBOOT] }),
      results: [
        row({ date: "2026-08-14", score: 50, factors: [USN_HIGH, REBOOT] }),
        row({ date: "2026-08-20", score: 60, factors: [USN_HIGH] }),
      ],
    });
    renderWithProviders(<HealthHistory computerId={COMPUTER_ID} />);

    const list = await screen.findByRole("list", { name: "Score changes" });
    const [newest, oldest] = within(list).getAllByRole("listitem");

    expect(newest).toHaveTextContent("Aug 20, 2026");
    expect(newest).toHaveTextContent("50 → to 60");
    expect(newest).toHaveTextContent("Reboot required cleared (+10)");

    expect(oldest).toHaveTextContent("Aug 14, 2026");
    expect(oldest).toHaveTextContent("90 → to 50");
    expect(oldest).toHaveTextContent(
      "High-severity security notice appeared (−40)",
    );
  });

  it("starts the graph from the baseline", async () => {
    respondWith({
      baseline: row({ date: "2026-07-28", score: 90, factors: [REBOOT] }),
      results: [
        row({ date: "2026-08-14", score: 50, factors: [USN_HIGH, REBOOT] }),
      ],
    });
    renderWithProviders(<HealthHistory computerId={COMPUTER_ID} />);

    const table = await screen.findByRole("table", { name: "Score by day" });
    // The baseline point and the one change.
    expect(within(table).getAllByRole("row")).toHaveLength(3);
  });

  it("says when the instance stopped being measured or the rules changed", async () => {
    respondWith({
      baseline: null,
      results: [
        row({
          date: "2026-08-01",
          score: 90,
          factors: [REBOOT],
          rules_version: 6,
        }),
        row({
          date: "2026-08-10",
          score: 80,
          factors: [REBOOT, REBOOT],
          rules_version: 7,
        }),
        row({ date: "2026-08-14", score: null }),
      ],
    });
    renderWithProviders(<HealthHistory computerId={COMPUTER_ID} />);

    const list = await screen.findByRole("list", { name: "Score changes" });
    const [unmeasured, rulesChanged, first] =
      within(list).getAllByRole("listitem");
    expect(unmeasured).toHaveTextContent(
      "The instance stopped being measured.",
    );
    expect(rulesChanged).toHaveTextContent(
      "The rules also changed since the previous entry.",
    );
    expect(first).toHaveTextContent("First recorded score.");
  });

  it("states the standing score when nothing changed in the window", async () => {
    respondWith({
      baseline: row({ date: "2026-07-28", score: 90, factors: [REBOOT] }),
      results: [],
    });
    renderWithProviders(<HealthHistory computerId={COMPUTER_ID} />);

    expect(
      await screen.findByText(/No change in this period/),
    ).toHaveTextContent("The score has been 90 since Jul 28, 2026.");
  });

  it("explains an empty history", async () => {
    respondWith({ baseline: null, results: [] });
    renderWithProviders(<HealthHistory computerId={COMPUTER_ID} />);
    expect(await screen.findByText(/No history yet/)).toBeInTheDocument();
  });

  it("reports a failed request", async () => {
    setEndpointStatus("error");
    renderWithProviders(<HealthHistory computerId={COMPUTER_ID} />);
    expect(
      await screen.findByText("The score history could not be loaded."),
    ).toBeInTheDocument();
  });
});
