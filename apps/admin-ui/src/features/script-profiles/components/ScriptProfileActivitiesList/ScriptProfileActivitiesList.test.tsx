import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { describe, it } from "vitest";
import ScriptProfileActivitiesList from "./ScriptProfileActivitiesList";

describe("ScriptProfileActivitiesList", () => {
  it("should render", () => {
    renderWithProviders(
      <ScriptProfileActivitiesList activities={activities} />,
    );
  });
});
