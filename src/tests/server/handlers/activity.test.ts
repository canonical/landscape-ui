import { API_URL } from "@/constants";
import type { Activity } from "@/features/activities";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { HttpStatusCode } from "axios";

describe("activity fixtures and filtering", () => {
  it("surfaces configured activity-detail API errors", async () => {
    setEndpointStatus({ status: "error", path: "activities/:id" });
    const response = await fetch(`${API_URL}activities/${activities[0].id}`);
    expect(response.status).toBe(HttpStatusCode.InternalServerError);
  });

  it("returns explicitly supplied list variants", async () => {
    setEndpointStatus({
      status: "variant",
      path: "activities",
      response: [activities[0]],
    });
    const response = await fetch(`${API_URL}activities?limit=20`);
    expect(await response.json()).toMatchObject({
      count: 1,
      results: [activities[0]],
    });
  });

  it.each([
    ["computer:id:0", (activity: Activity) => activity.computer_id === 0],
    ["created-after:2100-01-01", () => false],
    ["created-before:2000-01-01", () => false],
    [
      `parent-id:${activities[0].parent_id}`,
      (activity: Activity) => activity.parent_id === activities[0].parent_id,
    ],
  ])("filters %s against the actual fixtures", async (query, matches) => {
    const response = await fetch(
      `${API_URL}activities?query=${encodeURIComponent(query)}&limit=1000`,
    );
    const expected = activities.filter(matches);
    expect(await response.json()).toMatchObject({
      count: expected.length,
      results: expected,
    });
  });

  it("returns a 404 instead of another activity when a detail variant ID does not match", async () => {
    setEndpointStatus({
      status: "variant",
      path: "activities/:id",
      response: activities[0],
    });
    const found = await fetch(`${API_URL}activities/${activities[0].id}`);
    expect(await found.json()).toEqual(activities[0]);
    expect((await fetch(`${API_URL}activities/0`)).status).toBe(
      HttpStatusCode.NotFound,
    );
  });
});
