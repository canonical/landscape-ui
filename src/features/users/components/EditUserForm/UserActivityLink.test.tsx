import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { UserActivityEvent } from "../../types";
import { renderUserActivityLink } from "./helpers";

const event: UserActivityEvent = {
  activity_id: 103,
  activity_status: "undelivered",
  summary: "Editing user(s)",
  creation_time: "2026-08-17T10:00:00Z",
  completion_time: null,
  changes: [{ kind: "profile", field: "name" }],
};

describe("UserActivityLink", () => {
  it("renders nothing for undefined events through the helper and supports activity updates", () => {
    const { rerender } = renderWithProviders(renderUserActivityLink(undefined));
    expect(renderUserActivityLink(undefined)).toBeUndefined();

    expect(
      screen.queryByText(/This field is pending to be changed/),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(renderUserActivityLink(event));

    expect(
      screen.getByRole("button", { name: "View activity 103: Queued" }),
    ).toHaveTextContent("Editing user(s): Queued");

    rerender(renderUserActivityLink(undefined));

    expect(
      screen.queryByText(/This field is pending to be changed/),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
