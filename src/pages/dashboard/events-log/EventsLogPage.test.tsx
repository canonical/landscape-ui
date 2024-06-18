/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import EventsLogPage from "./EventsLogPage";
import { eventsLog } from "@/tests/mocks/eventslog";

describe("EventsLogPage", () => {
  it("renders empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<EventsLogPage />);

    const emptyStateTitle = await screen.findByText("No events found");
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("renders filtered list of events", async () => {
    renderWithProviders(<EventsLogPage />);

    const searchBox = await screen.findByRole("searchbox");
    await userEvent.type(searchBox, `${eventsLog[0].message}{enter}`);

    const messageCell = await screen.findByText(eventsLog[0].message);
    expect(messageCell).toBeInTheDocument();
  });
});
