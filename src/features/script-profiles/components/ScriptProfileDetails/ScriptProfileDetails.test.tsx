import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import ScriptProfileDetails from "./ScriptProfileDetails";

describe("ScriptProfileDetails", () => {
  it("should change tabs", async () => {
    renderWithProviders(<ScriptProfileDetails />);
    await expectLoadingState();

    await userEvent.click(screen.getByText("Activity history"));

    expect(screen.getByText("Run")).toBeInTheDocument();
  });
});
