import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setEndpointStatus } from "@/tests/controllers/controller";
import NewGPGKeyForm from "./NewGPGKeyForm";

describe("NewGPGKeyForm", () => {
  it("renders form fields", () => {
    const { container } = renderWithProviders(<NewGPGKeyForm />);

    expect(container).toHaveTexts(["Name", "Material"]);

    const addGPGKeyButton = screen.getByRole("button", {
      name: /import key/i,
    });
    expect(addGPGKeyButton).toBeInTheDocument();
  });

  it("shows required validation errors when submitting empty form", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NewGPGKeyForm />);

    await user.click(screen.getByRole("button", { name: /import key/i }));

    expect(await screen.findAllByText("This field is required")).toHaveLength(
      2,
    );
  });

  it("validates name format", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NewGPGKeyForm />);

    await user.type(
      screen.getByRole("textbox", { name: "Name" }),
      "Invalid_Name",
    );
    await user.type(screen.getByRole("textbox", { name: "Material" }), "ABC");
    await user.click(screen.getByRole("button", { name: /import key/i }));

    expect(
      await screen.findByText(
        "It has to start with an alphanumeric character and only contain lowercase letters, numbers and - or + signs.",
      ),
    ).toBeInTheDocument();
  });

  it("validates duplicate key name", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NewGPGKeyForm />);

    await user.type(screen.getByRole("textbox", { name: "Name" }), "sign-key");
    await user.type(screen.getByRole("textbox", { name: "Material" }), "ABC");
    await user.click(screen.getByRole("button", { name: /import key/i }));

    expect(
      await screen.findByText("It must be unique within the account."),
    ).toBeInTheDocument();
  });

  it("allows unique names when existing keys cannot be loaded", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "empty", path: "gpgKey" });

    renderWithProviders(<NewGPGKeyForm />);

    await user.type(screen.getByRole("textbox", { name: "Name" }), "sign-key");
    await user.type(screen.getByRole("textbox", { name: "Material" }), "ABC");
    await user.click(screen.getByRole("button", { name: /import key/i }));

    expect(
      screen.queryByText("It must be unique within the account."),
    ).not.toBeInTheDocument();
  });

  it("submits successfully", async () => {
    const user = userEvent.setup();

    renderWithProviders(<NewGPGKeyForm />);

    await user.type(screen.getByRole("textbox", { name: "Name" }), "newkey");
    await user.type(screen.getByRole("textbox", { name: "Material" }), "ABC");
    await user.click(screen.getByRole("button", { name: /import key/i }));

    expect(
      screen.queryByText("This field is required"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("It has to start with an alphanumeric character"),
    ).not.toBeInTheDocument();
  });

  it("shows endpoint error", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "importGpgKey" });

    renderWithProviders(<NewGPGKeyForm />);

    await user.type(screen.getByRole("textbox", { name: "Name" }), "newkey2");
    await user.type(screen.getByRole("textbox", { name: "Material" }), "ABC");
    await user.click(screen.getByRole("button", { name: /import key/i }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
