import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import LoadingState from "@/components/layout/LoadingState";
import EnvError from "@/pages/EnvError";

const ProfilesPage: FC = () => {
  const navigate = useNavigate();
  const { envLoading, envError, isSaas } = useEnv();

  useEffect(() => {
    if (envLoading || envError) {
      return;
    }

    navigate(
      isSaas ? ROUTES.profiles.repositoryProfiles() : ROUTES.profiles.package(),
      { replace: true },
    );
  }, [navigate, envLoading, envError, isSaas]);

  if (envError) return <EnvError />;
  return <LoadingState />;
};

export default ProfilesPage;
