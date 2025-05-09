import { instances } from "@/tests/mocks/instance";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import RunInstanceScriptForm from "./RunInstanceScriptForm";

const [instance] = instances;

const [script] = scripts;

describe("RunInstanceScriptForm", () => {
  const user = userEvent.setup();

  it("should display run instance script form", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);

    expect(screen.getByText(/run as user/i)).toBeInTheDocument();
    expect(screen.getByText("Time limit (seconds)")).toBeInTheDocument();

    expect(screen.getByText(/delivery time/i)).toBeInTheDocument();
  });

  it("should select a script from the dropdown", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);

    const scriptInput = screen.getByRole("searchbox", {
      name: /script/i,
    });

    expect(scriptInput).toBeInTheDocument();

    await user.click(scriptInput);
    await user.type(scriptInput, script.title);

    const options = await screen.findAllByRole("option");

    await user.click(options[0]);
    expect(screen.getByText(script.title)).toBeInTheDocument();
  });
});
