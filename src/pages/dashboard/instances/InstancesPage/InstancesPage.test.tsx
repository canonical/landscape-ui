import { renderWithProviders } from "@/tests/render";
import { describe, it } from "vitest";
import InstancesPage from "./InstancesPage";

describe("InstancesPage", () => {
  it("renders", () => {
    renderWithProviders(<InstancesPage />);
  });
});
