import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResponsiveTable from "./ResponsiveTable";
import type { Column } from "react-table";

const columns: Column<{ name: string; status: string; os: string }>[] = [
  {
    accessor: "name",
    Header: "name",
  },

  {
    accessor: "status",
    Header: "status",
  },
  {
    accessor: "os",
    Header: "OS",
  },
];

const data = [
  {
    name: "Instance 1",
    status: "Running",
    os: "Ubuntu 24.04 LTS",
  },
  {
    name: "Instance 2",
    status: "Stopped",
    os: "Windows 10 / Windows 11",
  },
];

describe("ResponsiveTable", () => {
  it("renders a table with provided data", () => {
    render(<ResponsiveTable columns={columns} data={data} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Instance 1")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("applies the default minWidth (1024px) to the table", () => {
    render(<ResponsiveTable columns={columns} data={data} />);
    const table = screen.getByRole("table");
    expect(table).toHaveStyle({ minWidth: "1024px" });
  });

  it("respects a custom minWidth prop", () => {
    render(<ResponsiveTable columns={columns} data={data} minWidth={1400} />);
    const table = screen.getByRole("table");
    expect(table).toHaveStyle({ minWidth: "1400px" });
  });

  it("forwards a ref to the underlying table element", () => {
    const ref = createRef<HTMLTableElement>();
    render(<ResponsiveTable ref={ref} columns={columns} data={data} />);

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });
});
