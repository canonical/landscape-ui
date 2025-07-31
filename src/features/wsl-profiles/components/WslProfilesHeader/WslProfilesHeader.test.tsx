import { renderWithProviders } from "@/tests/render";
import { describe, it } from "vitest";
import WslProfilesHeader from "./WslProfilesHeader";

describe("WslProfilesHeader", () => {
  it("should render", () => {
    renderWithProviders(<WslProfilesHeader />);
  });
});
