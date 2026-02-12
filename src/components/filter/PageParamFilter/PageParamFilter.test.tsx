import usePageParams from "@/hooks/usePageParams";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, FC } from "react";
import { describe, it } from "vitest";
import PageParamFilter from "./PageParamFilter";

const pageParamKey = "status";

const TestComponent: FC = () => {
  const pageParams = usePageParams();

  return <span>Value: {pageParams[pageParamKey]}</span>;
};

const props = {
  pageParamKey,
  label: "Status",
  options: [{ label: "Option 1", value: "option-1" }],
  onChange: vi.fn(),
} as const satisfies ComponentProps<typeof PageParamFilter>;

describe("PageParamFilter", () => {
  const user = userEvent.setup();

  it("sets the page param", async () => {
    renderWithProviders(
      <>
        <TestComponent />
        <PageParamFilter {...props} />)
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(
      screen.getByRole("button", { name: props.options[0].label }),
    );
    expect(
      screen.getByText(`Value: ${props.options[0].value}`),
    ).toBeInTheDocument();
    expect(props.onChange).toHaveBeenCalled();
  });
});
