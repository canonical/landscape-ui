import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicationsHeader from "./PublicationsHeader";
import usePageParams from "@/hooks/usePageParams/usePageParams";

const ComponentWithSearch = () => {
  const { query } = usePageParams();
  return (
    <>
      <PublicationsHeader />
      <div data-testid="query">{query}</div>
    </>
  );
};

describe("PublicationsHeader", () => {
  it("renders the search input with the current query", () => {
    renderWithProviders(<PublicationsHeader />, undefined, "/?query=focal");

    expect(screen.getByRole("searchbox")).toHaveValue("focal");
  });

  it("updates query page params when search is submitted", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ComponentWithSearch />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "  jammy  {enter}");

    expect(screen.getByTestId("query")).toHaveTextContent("jammy");
  });
});
