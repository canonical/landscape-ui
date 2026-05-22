import { beforeEach, describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import LocationDisplay from "@/tests/LocationDisplay";
import ProviderFormCta from "./ProviderFormCta";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ProviderFormCta", () => {
  beforeEach(({ task: { id } }) => {
    renderWithProviders(
      <>
        <ProviderFormCta action={id.endsWith("0") ? "edit" : "add"} />
        <LocationDisplay />
      </>,
      undefined,
      "/?sidePath=something"
    );
  });

  it("should render correctly when action is edit", () => {
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save changes")).toHaveProperty("type", "submit");
    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
  });

  it("should render correctly when action is add", () => {
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Add ID provider")).toHaveProperty(
      "type",
      "submit",
    );
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("should clear sidePath when back button is clicked", async () => {
    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=something");

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByTestId("location")).toHaveTextContent("");
  });
});

