import { FC, useEffect } from "react";
import { useNavigate } from "react-router";
import { ROOT_PATH } from "../../../constants";

const ProfilesPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${ROOT_PATH}profiles/package`, { replace: true });
  }, []);

  return null;
};

export default ProfilesPage;
