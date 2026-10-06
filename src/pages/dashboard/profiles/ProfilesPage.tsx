import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import LoadingState from "@/components/layout/LoadingState";

const ProfilesPage: FC = () => {
  const navigate = useNavigate();
  const { envLoading, isSaas } = useEnv();

  useEffect(() => {
    if (envLoading) {
      return;
    }

    navigate(
      isSaas ? ROUTES.profiles.repositoryProfiles() : ROUTES.profiles.package(),
      { replace: true },
    );
  }, [navigate, envLoading, isSaas]);

  return <LoadingState />;
};

export default ProfilesPage;
