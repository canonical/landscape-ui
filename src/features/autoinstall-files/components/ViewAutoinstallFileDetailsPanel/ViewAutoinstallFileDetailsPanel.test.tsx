import { autoinstallFiles as files } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import ViewAutoinstallFileDetailsPanel from ".";

describe("ViewAutoinstallFileDetailsPanel", () => {
  it("should render", async () => {
    renderWithProviders(<ViewAutoinstallFileDetailsPanel file={files[0]} />);
  });
});
