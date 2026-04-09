import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import NewGPGKeyForm from "./NewGPGKeyForm";
import userEvent from "@testing-library/user-event";

describe("NewGPGKeyForm", () => {
  const user = userEvent.setup();

  it("renders form fields", () => {
    const { container } = renderWithProviders(<NewGPGKeyForm />);

    expect(container).toHaveTexts(["Name", "Material"]);

    const addGPGKeyButton = screen.getByRole("button", {
      name: /import key/i,
    });
    expect(addGPGKeyButton).toBeInTheDocument();
  });

  it("submits GPG key and shows success notification", async () => {
    renderWithProviders(<NewGPGKeyForm />);

    const addGPGKeyButton = screen.getByRole("button", {
      name: /import key/i,
    });
    expect(addGPGKeyButton).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", { name: "Name" }),
      "testing-name",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Material" }),
      "testing material",
    );
    await user.click(addGPGKeyButton);

    expect(await screen.findByRole("heading", { name: "GPG key imported" })).toBeInTheDocument();
    expect(
      await screen.findByText(
        `GPG key "testing-name" was imported successfully.`,
      ),
    ).toBeInTheDocument();
  });
});
