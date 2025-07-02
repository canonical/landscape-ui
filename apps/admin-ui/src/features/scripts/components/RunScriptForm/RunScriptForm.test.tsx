import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import RunScriptForm from "./RunScriptForm";

const [script] = scripts;

describe("RunScriptForm", () => {
  const user = userEvent.setup();

  it("should display run script form", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    expect(await screen.findByText(/run script/i)).toBeInTheDocument();

    const tagsRadio = screen.getByRole("radio", {
      name: /tags/i,
    });

    const instanceIdsRadio = screen.getByRole("radio", {
      name: /instance names/i,
    });

    expect(tagsRadio).toBeInTheDocument();
    expect(instanceIdsRadio).toBeInTheDocument();

    expect(tagsRadio).toBeChecked();
    expect(instanceIdsRadio).not.toBeChecked();

    expect(screen.getByText(/select tags/i)).toBeInTheDocument();
    expect(screen.getByText(/run as user/i)).toBeInTheDocument();
    expect(screen.getByText("Time limit (seconds)")).toBeInTheDocument();
    expect(screen.getByText(/delivery time/i)).toBeInTheDocument();
  });

  it("should display instance names when instance names radio is checked", async () => {
    renderWithProviders(<RunScriptForm script={script} />);

    const instanceIdsRadio = await screen.findByRole("radio", {
      name: /instance names/i,
    });

    await user.click(instanceIdsRadio);

    expect(screen.getByText("Select instances")).toBeInTheDocument();
  });
});
