import { eventsLog } from "@/tests/mocks/eventsLog";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import EventsLogList from "./EventsLogList";

const props = {
  eventsLog,
};

describe("EventsList", () => {
  it("should render the events log", async () => {
    renderWithProviders(<EventsLogList {...props} />);

    const eventsLogTable = await screen.findByRole("table");
    expect(eventsLogTable).toBeInTheDocument();

    const columns = [
      "creation time",
      "username",
      "entity type",
      "entity name",
      "event log message",
    ];

    expect(eventsLogTable).toHaveTexts(columns);
  });
});
