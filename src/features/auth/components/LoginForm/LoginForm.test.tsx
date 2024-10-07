import { describe } from "vitest";
import LoginForm from "./LoginForm";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/render";

const user = {
  email: "john@example.com",
  password: "123456789",
};

describe("LoginForm", () => {
  it("should log in", async () => {
    renderWithProviders(<LoginForm />);

    await waitFor(() => {
      userEvent.type(screen.getByTestId("email"), user.email);

      userEvent.type(screen.getByTestId("password"), user.password);

      userEvent.click(
        screen.getByRole("button", {
          name: /sign in/i,
        }),
      );
    });
  });
});
