import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import RepositoryProfileAddSidePanel from "./RepositoryProfileAddSidePanel";

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

const renderPanel = (sidePath = "add") =>
  renderWithProviders(
    <>
      <RepositoryProfileAddSidePanel />
      <LocationDisplay />
    </>,
    undefined,
    `/?sidePath=${sidePath}`,
  );

describe("RepositoryProfileAddSidePanel", () => {
  const user = userEvent.setup();

  it("renders the panel title on main step", () => {
    renderPanel();

    expect(screen.getByText("Add repository profile")).toBeInTheDocument();
  });

  it("renders the repository profile form on main step", () => {
    renderPanel();

    expect(
      screen.getByRole("button", { name: /Add a new repository profile/i }),
    ).toBeInTheDocument();
  });

  it("renders add source breadcrumb header when on add-source step", () => {
    renderPanel("add,add-source");

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Add repository profile");
    expect(heading).toHaveTextContent("/ Add source");
  });

  it("renders edit source breadcrumb header when on edit-source step", () => {
    renderPanel("add,edit-source");

    expect(screen.getByText(/Edit source/i)).toBeInTheDocument();
    expect(screen.getByText("Add repository profile")).toBeInTheDocument();
  });

  it("renders the source form when on add-source step", () => {
    renderPanel("add,add-source");

    expect(screen.getByLabelText(/source name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deb line/i)).toBeInTheDocument();
  });

  it("renders the source form when on edit-source step", () => {
    renderPanel("add,edit-source");

    expect(screen.getByLabelText(/source name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deb line/i)).toBeInTheDocument();
  });

  it("navigates to add-source step when clicking add source button", async () => {
    renderPanel();

    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(screen.getByTestId("location")).toHaveTextContent("add-source");
  });

  it("navigates back to main step when clicking breadcrumb link on add-source step", async () => {
    renderPanel("add,add-source");

    const breadcrumbLink = screen.getByRole("link", {
      name: "Add repository profile",
    });
    await user.click(breadcrumbLink);

    expect(screen.getByTestId("location")).not.toHaveTextContent("add-source");
  });

  it("navigates back to main step after submitting add-source form", async () => {
    renderPanel("add,add-source");

    await user.type(screen.getByLabelText(/source name/i), "my-source");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://example.com/ubuntu focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).not.toHaveTextContent(
        "add-source",
      );
    });
  });

  it("clicking cancel on source form navigates back to main step", async () => {
    renderPanel("add,add-source");

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).not.toHaveTextContent(
        "add-source",
      );
    });
  });

  it("added source appears in sources table after returning to main step", async () => {
    renderPanel("add,add-source");

    await user.type(screen.getByLabelText(/source name/i), "my-source");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://example.com/ubuntu focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).not.toHaveTextContent(
        "add-source",
      );
    });
    expect(screen.getByText("my-source")).toBeInTheDocument();
  });

  it("renders 'Edit repository profile' title when sidePath starts with 'edit'", () => {
    renderPanel("edit");

    expect(screen.getByText("Edit repository profile")).toBeInTheDocument();
  });

  it("renders 'Edit repository profile' as breadcrumb prefix on edit-source step", () => {
    renderPanel("edit,edit-source");

    expect(screen.getByText("Edit repository profile")).toBeInTheDocument();
    expect(screen.getByText(/Edit source/i)).toBeInTheDocument();
  });

  it("edit source pre-populates form fields with existing source values", async () => {
    renderPanel("add,add-source");

    await user.type(screen.getByLabelText(/source name/i), "my-source");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://example.com/ubuntu focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).not.toHaveTextContent(
        "add-source",
      );
    });

    await user.click(screen.getByRole("button", { name: /edit my-source/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("edit-source");
    });

    expect(screen.getByLabelText(/source name/i)).toHaveValue("my-source");
    expect(screen.getByLabelText(/deb line/i)).toHaveValue(
      "deb http://example.com/ubuntu focal main",
    );
  });

  it("editing a source updates the existing entry instead of adding a new one", async () => {
    renderPanel("add,add-source");

    await user.type(screen.getByLabelText(/source name/i), "my-source");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://example.com/ubuntu focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).not.toHaveTextContent(
        "add-source",
      );
    });

    await user.click(screen.getByRole("button", { name: /edit my-source/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("edit-source");
    });

    await user.clear(screen.getByLabelText(/source name/i));
    await user.type(screen.getByLabelText(/source name/i), "updated-source");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).not.toHaveTextContent(
        "edit-source",
      );
    });

    expect(screen.getByText("updated-source")).toBeInTheDocument();
    expect(screen.queryByText("my-source")).not.toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2); // header + 1 data row
  });

  it("removes a source from the table when the remove button is clicked", async () => {
    renderPanel("add,add-source");

    await user.type(screen.getByLabelText(/source name/i), "to-remove");
    await user.type(
      screen.getByLabelText(/deb line/i),
      "deb http://example.com/ubuntu focal main",
    );
    await user.click(screen.getByRole("button", { name: /add source/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).not.toHaveTextContent(
        "add-source",
      );
    });

    await user.click(screen.getByRole("button", { name: /remove to-remove/i }));

    expect(screen.queryByText("to-remove")).not.toBeInTheDocument();
  });

  it("shows validation error when submitting source form with empty required fields", async () => {
    renderPanel("add,add-source");

    await user.click(screen.getByRole("button", { name: /add source/i }));

    expect(await screen.findAllByText("This field is required.")).toHaveLength(
      2,
    );
  });
});
