import PageHeader from "./PageHeader";
import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "../../../types/Breadcrumb";
import { renderWithProviders } from "../../../../vitest/render";

describe("PageHeader", () => {
  it("renders title", () => {
    const props = {
      title: "Page Header Title",
    };

    render(<PageHeader {...props} />);

    expect(screen.getByRole("heading").innerHTML).toContain(props.title);
  });

  it("renders visual title", () => {
    const props = {
      title: "Page Header Title",
      hideTitle: true,
      visualTitle: "Page Header Visual Title",
    };

    render(<PageHeader {...props} />);

    expect(screen.getByText(props.title)).toBeOffScreen();
    expect(screen.getByText(props.visualTitle)).toBeInTheDocument();
  });

  it("renders breadcrumbs", () => {
    const props = {
      title: "Page Header Title",
      breadcrumbs: [
        { label: "Link 1", path: "/link-1" },
        { label: "Link 2", path: "/link-2" },
        { label: "Link 3", current: true },
      ] as Breadcrumb[],
    };

    renderWithProviders(<PageHeader {...props} />);

    props.breadcrumbs.forEach((breadcrumb) => {
      if (breadcrumb.current) {
        expect(screen.getByText(breadcrumb.label)).toBeInTheDocument();
      } else {
        expect(screen.getByText(breadcrumb.label).closest("a")).toHaveAttribute(
          "href",
          breadcrumb.path,
        );
      }
    });
  });

  it("renders actions", () => {
    const buttonTitle = "Action 1";

    const props = {
      title: "Page Header Title",
      actions: [<button key="1">{buttonTitle}</button>],
    };

    render(<PageHeader {...props} />);

    expect(screen.getByText(buttonTitle)).toBeInTheDocument();
  });
});
