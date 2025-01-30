import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const ProfilesPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/profiles/package", { replace: true });
  }, []);

  return null;
};

export default ProfilesPage;
