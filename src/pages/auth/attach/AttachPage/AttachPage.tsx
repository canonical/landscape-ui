import { OTPInputContainer, SuccessfulAttachPage } from "@/features/attach";
import type { FC } from "react";
import { useSearchParams } from "react-router";

const AttachPage: FC = () => {
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");

  if (success === "true") {
    return <SuccessfulAttachPage />;
  }

  return <OTPInputContainer />;
};

export default AttachPage;
