import LoadingState from "@/components/layout/LoadingState";
import { SupportSessionContainer } from "@/features/super-admin";
import type { FC } from "react";
import { Suspense } from "react";
import { Outlet, useParams } from "react-router";

const SupportSessionPage: FC = () => {
  const { name = "" } = useParams<{ name: string }>();

  return (
    <SupportSessionContainer name={name}>
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </SupportSessionContainer>
  );
};

export default SupportSessionPage;
