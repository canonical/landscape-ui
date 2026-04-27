import { renderWithProviders } from "@/tests/render";
import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import OTPInputContainer from "./OTPInputContainer";

describe("OTPInputContainer", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should render the component with the correct title", () => {
    renderWithProviders(<OTPInputContainer />);
    expect(
      screen.getByRole("heading", { name: /enter code to connect/i }),
    ).toBeInTheDocument();

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("should show a validation error if the code is not complete", async () => {
    renderWithProviders(<OTPInputContainer />);

    const inputs = screen.getAllByRole("textbox");
    assert(inputs[0]);
    await user.type(inputs[0], "1");

    const submitButton = screen.getByRole("button", { name: /next/i });
    await user.click(submitButton);

    const errorMessage = screen.getByText("Code must be 6 characters long");
    expect(errorMessage).toBeInTheDocument();
  });

  it("does not show length validation error when code is complete", async () => {
    renderWithProviders(<OTPInputContainer />);

    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < 6; i++) {
      const input = inputs[i];
      assert(input);
      await user.type(input, String(i + 1));
    }

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(
      screen.queryByText("Code must be 6 characters long"),
    ).not.toBeInTheDocument();
  });

  it("prefills code from query string when code is incomplete", () => {
    renderWithProviders(
      <OTPInputContainer />,
      undefined,
      `${ROUTES.auth.attach({ code: "QWER1" })}`,
      PATHS.auth.attach,
    );

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("Q");
    expect(inputs[1]).toHaveValue("W");
    expect(inputs[2]).toHaveValue("E");
    expect(inputs[3]).toHaveValue("R");
    expect(inputs[4]).toHaveValue("1");
    expect(inputs[5]).toHaveValue("");
  });

  it("shows expired-code error and stays on attach page", async () => {
    renderWithProviders(
      <OTPInputContainer />,
      undefined,
      `${ROUTES.auth.attach({ code: "EXPIRE" })}`,
      PATHS.auth.attach,
    );

    expect(
      await screen.findByText(
        "The code you entered has expired and is no longer valid.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /enter code to connect to the ubuntu installer/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows endpoint error when verify request fails", async () => {
    setEndpointStatus({
      status: "error",
      path: "ubuntu-installer-attach-sessions/code",
    });

    renderWithProviders(
      <OTPInputContainer />,
      undefined,
      `${ROUTES.auth.attach({ code: "QWERTY" })}`,
      PATHS.auth.attach,
    );

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
