import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import MirrorActions from "./MirrorActions";

describe("MirrorActions", () => {
  it("renders", () => {
    renderWithProviders(
      <MirrorActions
        mirrorDisplayName="Mirror display name"
        mirrorName="mirrors/name"
      />,
    );
  });
});
