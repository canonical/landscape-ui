import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccessGroupChange from "./AccessGroupChange";

const selected = instances.slice(0, 2);
const newAccessGroup = "test";

describe("AccessGroupChange", () => {
  test("should Assign access group for selected instances", async () => {
    renderWithProviders(<AccessGroupChange selected={selected} />);

    expect(
      screen.queryByText("This field is required"),
    ).not.toBeInTheDocument();

    const select = await screen.findByRole("combobox", {
      name: /access group/i,
    });

    await userEvent.selectOptions(select, newAccessGroup);

    expect(
      screen.queryByText("This field is required"),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /assign/i }));

    expect(screen.getByText("Access group changed")).toBeInTheDocument();
    expect(
      screen.getByText(
        `Access group for ${selected.length} instances successfully changed to ${newAccessGroup}`,
      ),
    ).toBeInTheDocument();
  });
});
