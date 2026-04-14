import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViewProfileInfoTab from "./ViewProfileInfoTab";
import { ProfileTypes } from "../../../../helpers";
import { profiles } from "@/tests/mocks/profiles";

vi.mock("../ViewProfileGeneralBlock", () => ({
  default: () => <div>general block</div>,
}));

vi.mock("../ViewProfileDetailsBlock", () => ({
  default: () => <div>details block</div>,
}));

vi.mock("../ViewProfileAssociationBlock", () => ({
  default: () => <div>association block</div>,
}));

vi.mock("../ViewProfileScheduleBlock", () => ({
  default: () => <div>schedule block</div>,
}));

const [profile] = profiles;

describe("ViewProfileInfoTab", () => {
  it.each([
    [ProfileTypes.script],
    [ProfileTypes.security],
    [ProfileTypes.upgrade],
    [ProfileTypes.reboot],
  ])("renders schedule block for %s profile", async (type) => {
    renderWithProviders(<ViewProfileInfoTab profile={profile} type={type} />);

    expect(await screen.findByText("general block")).toBeInTheDocument();
    expect(await screen.findByText("details block")).toBeInTheDocument();
    expect(await screen.findByText("association block")).toBeInTheDocument();
    expect(await screen.findByText("schedule block")).toBeInTheDocument();
  });

  it.each([
    [ProfileTypes.package],
    [ProfileTypes.repository],
    [ProfileTypes.removal],
    [ProfileTypes.wsl],
  ])("does not render schedule block for %s profile", async (type) => {
    renderWithProviders(<ViewProfileInfoTab profile={profile} type={type} />);

    expect(await screen.findByText("general block")).toBeInTheDocument();
    expect(await screen.findByText("details block")).toBeInTheDocument();
    expect(await screen.findByText("association block")).toBeInTheDocument();
    expect(screen.queryByText("schedule block")).not.toBeInTheDocument();
  });
});
