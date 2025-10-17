import usePageParams from "@/hooks/usePageParams";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FC } from "react";
import { describe, expect, it } from "vitest";
import PassRateFilterBase from "./PassRateFilterBase";

const TestComponent: FC = () => {
  const { passRateFrom, passRateTo } = usePageParams();

  return (
    <>
      From {passRateFrom} to {passRateTo}
    </>
  );
};

describe("PassRateFilterBase", () => {
  const user = userEvent.setup();

  it("renders an error message when the maximum is less than the minimum", async () => {
    renderWithProviders(<PassRateFilterBase />);

    const input = screen.getByRole("spinbutton", { name: "To" });
    await user.clear(input);
    await user.type(input, "-1");
    await user.tab();
    expect(
      screen.getByText("Must not be less than minimum pass rate"),
    ).toBeInTheDocument();
  });

  it("resets the page params", async () => {
    const closeMenu = vi.fn();

    renderWithProviders(
      <>
        <PassRateFilterBase closeMenu={closeMenu} />
        <TestComponent />
      </>,
      undefined,
      "/?passRateFrom=25&passRateTo=75",
    );

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText(`From ${0} to ${100}`)).toBeInTheDocument();
    expect(closeMenu).toHaveBeenCalledExactlyOnceWith();
  });
});
