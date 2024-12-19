import { describe } from "vitest";
import { autoinstallFiles as files } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import ViewAutoinstallFileDetailsEventLog from ".";

describe("ViewAutoinstallFileDetailsEventLog", () => {
  it("should render", async () => {
    renderWithProviders(
      <ViewAutoinstallFileDetailsEventLog events={files[0].events} />,
    );
  });
});
