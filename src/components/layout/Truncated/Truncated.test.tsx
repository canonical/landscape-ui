import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { describe } from "vitest";
import Truncated from "./Truncated";

const TruncatedItem: FC<
  Pick<ComponentProps<typeof Truncated>, "content" | "showCount">
> = (props) => {
  const { value: isExpanded, setTrue: expand } = useBoolean();

  return (
    <Truncated
      expandedClassName=""
      isExpanded={isExpanded}
      onExpand={expand}
      {...props}
    />
  );
};

describe("Truncated", () => {
  const TEST_COUNT = 50;

  it("should render", async () => {
    const content = Array(TEST_COUNT).fill("Item").join(", ");

    renderWithProviders(<TruncatedItem content={content} />);

    await userEvent.click(screen.getByText("Show more"));

    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it("should show count", async () => {
    const content = Array(TEST_COUNT)
      .fill("Item, ")
      .map((item, index) => {
        return <span key={index}>{item}</span>;
      });

    renderWithProviders(<TruncatedItem content={content} showCount />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent(/\+\d+/);

    await userEvent.click(button);
  });
});
