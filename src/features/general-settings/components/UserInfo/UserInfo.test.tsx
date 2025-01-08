import { render } from "@testing-library/react";
import UserInfo from "./UserInfo";
import { userDetails } from "@/tests/mocks/user";

describe("UserInfo", () => {
  it("should show user info", () => {
    const { container } = render(<UserInfo userDetails={userDetails} />);

    expect(container).toHaveInfoItem("Name", userDetails.name);
    expect(container).toHaveInfoItem("Email", userDetails.email);
  });
});
