import { ComponentProps } from "react";
import { Column } from "react-table";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ExpandableTable from "./ExpandableTable";

const limit = 5;
const totalCount = 7;

interface TestData extends Record<string, unknown> {
  id: number;
  name: string;
  description: string;
}

const data = Array.from(
  { length: limit },
  (_, i): TestData => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }),
);

const columns: Column<TestData>[] = [
  {
    accessor: "name",
    Header: "Name",
  },
  {
    accessor: "description",
    Header: "Description",
  },
];

const onLimitChange = vi.fn();

const props: ComponentProps<typeof ExpandableTable<TestData>> = {
  columns,
  data,
  itemNames: {
    singular: "item",
    plural: "items",
  },
  onLimitChange,
  totalCount,
};

describe("ExpandableTable", () => {
  it("should render expandable table with the footer", async () => {
    render(<ExpandableTable {...props} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Description for item 1")).toBeInTheDocument();
    expect(screen.getAllByText(/description for item \d+/i)).toHaveLength(
      limit,
    );
    expect(
      screen.getByText(`Showing ${limit} of ${totalCount} items.`),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(
      `Show ${totalCount - limit} more`,
    );
  });

  it("table should have the title", () => {
    render(<ExpandableTable {...props} title="Test title" />);

    expect(screen.getByText("Test title")).toBeInTheDocument();
  });
});
