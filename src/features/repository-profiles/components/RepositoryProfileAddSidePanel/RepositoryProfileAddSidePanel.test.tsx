import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileAddSidePanel from "./RepositoryProfileAddSidePanel";

vi.mock("../RepositoryProfileForm", () => ({
  default: ({ action }: { action: string }) => <div>{`form:${action}`}</div>,
}));

describe("RepositoryProfileAddSidePanel", () => {
  it("renders title and form", () => {
    render(<RepositoryProfileAddSidePanel />);
    expect(screen.getByText("Add repository profile")).toBeInTheDocument();
    expect(screen.getByText(`form:add`)).toBeInTheDocument();
  });
});
