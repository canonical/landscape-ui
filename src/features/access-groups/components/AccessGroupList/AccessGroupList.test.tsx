import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import AccessGroupList from "./AccessGroupList";

describe("AccessGroupList", () => {
  beforeEach(() => {
    renderWithProviders(<AccessGroupList accessGroups={accessGroups} />);
  });

  it("renders a list of access groups", async () => {
    for (const accessGroup of accessGroups) {
      screen.getByRole("rowheader", {
        name: accessGroup.title,
      });
    }
  });

  it("shows NoData for the parent column of root access groups", () => {
    const globalGroup = accessGroups.find(
      (g) => g.name === DEFAULT_ACCESS_GROUP_NAME,
    );
    assert(globalGroup);

    const row = screen.getByRole("row", {
      name: (name) => name.includes(globalGroup.title),
    });

    const parentCell = row.querySelector('[aria-label="Parent"]');
    expect(parentCell).toHaveTextContent(NO_DATA_TEXT);
  });

  it("shows the parent title in the parent column for child groups", () => {
    const childGroup = accessGroups.find(
      (g) => g.parent === DEFAULT_ACCESS_GROUP_NAME,
    );
    assert(childGroup);

    const parentGroup = accessGroups.find((g) => g.name === childGroup.parent);
    assert(parentGroup);

    const row = screen.getByRole("row", {
      name: (name) => name.includes(childGroup.title),
    });

    const parentCell = row.querySelector('[aria-label="Parent"]');
    expect(parentCell).toHaveTextContent(parentGroup.title);
  });

  it("does not render actions button for the global access group", () => {
    const globalGroup = accessGroups.find(
      (g) => g.name === DEFAULT_ACCESS_GROUP_NAME,
    );
    assert(globalGroup);

    expect(
      screen.queryByLabelText(`${globalGroup.title} access group actions`),
    ).not.toBeInTheDocument();
  });

  describe("Remove Access Group", () => {
    it("opens confirmation modal when delete button is clicked", async () => {
      const [, groupToDelete] = accessGroups; // Developers

      await userEvent.click(
        screen.getByLabelText(`${groupToDelete.title} access group actions`),
      );

      await userEvent.click(
        screen.getByLabelText(`Delete "${groupToDelete.title}" access group`),
      );

      const confirmationTitle = await screen.findByText(
        `Deleting ${groupToDelete.title} access group`,
      );
      expect(confirmationTitle).toBeInTheDocument();

      const confirmationMessage = screen.getByText(/irreversible/i);
      expect(confirmationMessage).toBeInTheDocument();

      const confirmButton = screen.getByRole("button", { name: /delete/i });
      expect(confirmButton).toBeInTheDocument();
    });
  });
});

describe("AccessGroupList with search filter", () => {
  it("filters access groups by name", () => {
    const targetGroup = accessGroups.find((g) => g.name === "server");
    assert(targetGroup);

    renderWithProviders(
      <AccessGroupList accessGroups={accessGroups} />,
      undefined,
      `/?search=${targetGroup.name}`,
    );

    expect(
      screen.getByRole("rowheader", { name: targetGroup.title }),
    ).toBeInTheDocument();

    const nonMatchingGroup = accessGroups.find((g) => g.name === "desktop");
    assert(nonMatchingGroup);
    expect(
      screen.queryByRole("rowheader", { name: nonMatchingGroup.title }),
    ).not.toBeInTheDocument();
  });

  it("filters access groups by title", () => {
    const targetGroup = accessGroups.find((g) => g.name === "desktop");
    assert(targetGroup);

    renderWithProviders(
      <AccessGroupList accessGroups={accessGroups} />,
      undefined,
      `/?search=Desktop`,
    );

    expect(
      screen.getByRole("rowheader", { name: targetGroup.title }),
    ).toBeInTheDocument();

    const nonMatchingGroup = accessGroups.find((g) => g.name === "server");
    assert(nonMatchingGroup);
    expect(
      screen.queryByRole("rowheader", { name: nonMatchingGroup.title }),
    ).not.toBeInTheDocument();
  });

  it("shows empty message when no groups match search", () => {
    renderWithProviders(
      <AccessGroupList accessGroups={accessGroups} />,
      undefined,
      `/?search=nonexistentgroup`,
    );

    expect(
      screen.getByText(
        "No access groups found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });
});

describe("AccessGroupList with groupBy=parent", () => {
  it("renders access groups in tree hierarchy", () => {
    renderWithProviders(
      <AccessGroupList accessGroups={accessGroups} />,
      undefined,
      "/?groupBy=parent",
    );

    const globalGroup = accessGroups.find(
      (g) => g.name === DEFAULT_ACCESS_GROUP_NAME,
    );
    assert(globalGroup);

    expect(
      screen.getByRole("rowheader", { name: globalGroup.title }),
    ).toBeInTheDocument();
  });

  it("shows nested groups under their parent", () => {
    renderWithProviders(
      <AccessGroupList accessGroups={accessGroups} />,
      undefined,
      "/?groupBy=parent",
    );

    const globalGroup = accessGroups.find(
      (g) => g.name === DEFAULT_ACCESS_GROUP_NAME,
    );
    assert(globalGroup);
    expect(
      screen.getByRole("rowheader", { name: globalGroup.title }),
    ).toBeInTheDocument();

    const childGroup = accessGroups.find(
      (g) => g.parent === DEFAULT_ACCESS_GROUP_NAME,
    );
    assert(childGroup);
    expect(
      screen.getByRole("rowheader", { name: childGroup.title }),
    ).toBeInTheDocument();
  });
});
