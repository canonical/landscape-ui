import usePageParams from "@/hooks/usePageParams";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FC } from "react";
import { describe, it } from "vitest";
import PageParamFilter from "./PageParamFilter";

const pageParamKey = "status";

const TestComponent: FC = () => {
  const pageParams = usePageParams();

  return <span>Value: {pageParams[pageParamKey]}</span>;
};

describe("PageParamFilter", () => {
  const user = userEvent.setup();

  it("sets the page param", async () => {
    const label = "Option 1";
    const value = "option-1";

    renderWithProviders(
      <>
        <TestComponent />
        <PageParamFilter
          pageParamKey={pageParamKey}
          label="Status"
          options={[{ label, value }]}
        />
        )
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByRole("button", { name: label }));
    expect(screen.getByText(`Value: ${value}`)).toBeInTheDocument();
  });
});
