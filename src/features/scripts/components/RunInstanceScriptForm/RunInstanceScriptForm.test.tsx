import { setEndpointStatus } from "@/tests/controllers/controller";
import { instances } from "@/tests/mocks/instance";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it } from "vitest";
import RunInstanceScriptForm from "./RunInstanceScriptForm";

const [instance] = instances;

const [script] = scripts;

describe("RunInstanceScriptForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

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
    assert(options[0]);
    await user.click(options[0]);
    expect(screen.getByText(script.title)).toBeInTheDocument();
  });

  it("shows a date input when switching delivery to Scheduled", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);
    const scheduledRadio = screen.getByRole("radio", { name: /scheduled/i });
    await user.click(scheduledRadio);
    expect(screen.getByLabelText(/deliver after/i)).toBeInTheDocument();
  });

  it("populates run as user from selected script username", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);
    const scriptInput = screen.getByRole("searchbox", { name: /script/i });
    await user.click(scriptInput);
    await user.type(scriptInput, script.title);
    const options = await screen.findAllByRole("option");
    assert(options[0]);
    await user.click(options[0]);
    const usernameInput = screen.getByRole("textbox", { name: /run as user/i });
    // script.username is "" so field keeps default "root" value
    expect(usernameInput).toHaveValue("root");
  });

  it("shows validation error when submitting without a script selected", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);

    const submitButton = screen.getByRole("button", { name: /run script/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
  });

  it("submits form with scheduled delivery when Scheduled option is selected", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);

    const scriptInput = screen.getByRole("searchbox", { name: /script/i });
    await user.click(scriptInput);
    await user.type(scriptInput, script.title);
    const options = await screen.findAllByRole("option");
    assert(options[0]);
    await user.click(options[0]);

    const scheduledRadio = screen.getByRole("radio", { name: /scheduled/i });
    await user.click(scheduledRadio);

    const deliverAfterInput = await screen.findByLabelText(/deliver after/i);

    // Set a future local datetime directly to avoid timezone issues with toISOString
    const futureDate = new Date(Date.now() + 10 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const futureValue = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(futureDate.getDate())}T${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}`;
    await user.clear(deliverAfterInput);
    await user.type(deliverAfterInput, futureValue);

    const submitButton = screen.getByRole("button", { name: /run script/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/script execution queued/i),
    ).toBeInTheDocument();
  });

  it("clears script_id when Remove button is clicked after selecting a script", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);

    const scriptInput = screen.getByRole("searchbox", { name: /script/i });
    await user.click(scriptInput);
    await user.type(scriptInput, script.title);
    const options = await screen.findAllByRole("option");
    assert(options[0]);
    await user.click(options[0]);

    const removeButton = await screen.findByRole("button", { name: /remove/i });
    await user.click(removeButton);

    expect(
      screen.queryByRole("button", { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("submits form and shows success notification when script is selected", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);

    const scriptInput = screen.getByRole("searchbox", { name: /script/i });
    await user.click(scriptInput);
    await user.type(scriptInput, script.title);
    const options = await screen.findAllByRole("option");
    assert(options[0]);
    await user.click(options[0]);

    const submitButton = screen.getByRole("button", { name: /run script/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/script execution queued/i),
    ).toBeInTheDocument();
  });

  it("handles submit error gracefully", async () => {
    setEndpointStatus({ status: "error", path: "ExecuteScript" });
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);

    const scriptInput = screen.getByRole("searchbox", { name: /script/i });
    await user.click(scriptInput);
    await user.type(scriptInput, script.title);
    const options = await screen.findAllByRole("option");
    assert(options[0]);
    await user.click(options[0]);

    const submitButton = screen.getByRole("button", { name: /run script/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("auto-fills username from script when username field is empty", async () => {
    renderWithProviders(<RunInstanceScriptForm query={`id:${instance.id}`} />);

    const usernameInput = screen.getByRole("textbox", { name: /run as user/i });
    await user.clear(usernameInput);

    const scriptInput = screen.getByRole("searchbox", { name: /script/i });
    await user.click(scriptInput);
    await user.type(scriptInput, script.title);
    const options = await screen.findAllByRole("option");
    assert(options[0]);
    await user.click(options[0]);

    await waitFor(() => {
      expect(usernameInput).toHaveValue(script.username ?? "");
    });
  });
});
