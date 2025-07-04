import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import TruncatedCell from "./TruncatedCell";

describe("TruncatedCell", () => {
  it("should render", async () => {
    const content = Array(50).fill("Item").join(", ");

    renderWithProviders(
      <TruncatedCell
        content={content}
        isExpanded={false}
        onExpand={() => undefined}
      />,
    );

    await userEvent.click(screen.getByText("Show more"));

    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it("should show count", async () => {
    const content = Array(50)
      .fill("Item, ")
      .map((item, index) => {
        return <span key={index}>{item}</span>;
      });

    renderWithProviders(
      <TruncatedCell
        content={content}
        isExpanded={false}
        onExpand={() => undefined}
        showCount
      />,
    );

    expect(screen.getByRole("button")).toHaveTextContent(/\+\d+/);
  });
});
