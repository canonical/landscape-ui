import { eventsLog } from "@/tests/mocks/eventslog";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import EventsLogList from "./EventsLogList";

const props = {
  eventsLog,
};

describe("EventsList", () => {
  beforeEach(() => {
    renderWithProviders(<EventsLogList {...props} />);
  });

  it("should render the events log", async () => {
    const eventsLogTable = await screen.findByRole("table");
    expect(eventsLogTable).toBeInTheDocument();
  });
});
