import { OTPInputContainer, SuccessfulAttachPage } from "@/features/attach";
import { type FC } from "react";
import { useLocation } from "react-router";

const AttachPage: FC = () => {
  const location = useLocation();
  const success = location.state?.success;

  if (success === true) {
    return <SuccessfulAttachPage />;
  }

  return <OTPInputContainer />;
};

export default AttachPage;
