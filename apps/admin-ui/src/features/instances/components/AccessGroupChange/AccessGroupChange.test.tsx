import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccessGroupChange from "./AccessGroupChange";
import { pluralize } from "@/utils/_helpers";

const selectedMultiple = instances.slice(0, 2);
const selectedSingle = instances.slice(0, 1);
const newAccessGroup = "test";

describe("AccessGroupChange", () => {
  it("should Assign access group for single selected instance", async () => {
    renderWithProviders(<AccessGroupChange selected={selectedSingle} />);

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
        `Access group for ${pluralize(selectedSingle.length, `"${selectedSingle[0]?.title ?? ""}" instance`, `${selectedSingle.length} instances`)} successfully changed to ${newAccessGroup}`,
      ),
    ).toBeInTheDocument();
  });

  it("should Assign access group for selected instances", async () => {
    renderWithProviders(<AccessGroupChange selected={selectedMultiple} />);

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
        `Access group for ${pluralize(selectedMultiple.length, `"${selectedMultiple[0]?.title ?? ""}" instance`, `${selectedMultiple.length} instances`)} successfully changed to ${newAccessGroup}`,
      ),
    ).toBeInTheDocument();
  });
});
