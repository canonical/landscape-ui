import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import CreateScriptForm from "./CreateScriptForm";

describe("CreateScriptForm", () => {
  it("should display create script form", async () => {
    renderWithProviders(<CreateScriptForm />);

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/code/i)).toBeInTheDocument();
    expect(screen.getByText("Access group")).toBeInTheDocument();
    expect(screen.getByText(/list of attachments/i)).toBeInTheDocument();
    expect(screen.getByText(/create script/i)).toBeInTheDocument();
  });
});
