import { describe } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { autoinstallFiles as files } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import ViewAutoinstallFileDetailsTabs from "./ViewAutoinstallFileDetailsTabs";

describe("ViewAutoinstallFileDetailsTabs", () => {
  it("should change tabs", async () => {
    renderWithProviders(<ViewAutoinstallFileDetailsTabs file={files[0]} />);
    await userEvent.click(screen.getByRole("tab", { name: "Event log" }));
  });
});
