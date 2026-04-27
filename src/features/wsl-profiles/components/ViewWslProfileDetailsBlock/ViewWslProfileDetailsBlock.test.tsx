import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViewWslProfileDetailsBlock from "./ViewWslProfileDetailsBlock";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("ViewWslProfileDetailsBlock", () => {
  it("shows image source for custom image profiles", () => {
    const cloudInit = "#cloud-config";
    const profile = {
      ...wslProfiles[1],
      cloud_init_contents: cloudInit,
    };

    render(<ViewWslProfileDetailsBlock profile={profile} />);

    expect(screen.getByText("Rootfs image")).toBeInTheDocument();
    expect(screen.getByText("From URL")).toBeInTheDocument();
    expect(screen.getByText("Image name")).toBeInTheDocument();
    expect(screen.getByText(profile.image_name)).toBeInTheDocument();
    expect(screen.getByText("Image source")).toBeInTheDocument();
    expect(screen.getByText(profile.image_source)).toBeInTheDocument();
    expect(screen.getByText("Cloud init")).toBeInTheDocument();
    expect(screen.getByText(/#cloud-config/)).toBeInTheDocument();
    expect(screen.getByText("Compliance settings")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Uninstall WSL child instances that have not been created by Landscape",
      ),
    ).toBeInTheDocument();
  });

  it("hides image source for store image profiles", () => {
    const profile = {
      ...wslProfiles[0],
    };

    render(<ViewWslProfileDetailsBlock profile={profile} />);

    expect(screen.queryByText("Image source")).not.toBeInTheDocument();
    expect(screen.getByText("Cloud init")).toBeInTheDocument();
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ignore WSL child instances that have not been created by Landscape",
      ),
    ).toBeInTheDocument();
  });
});
