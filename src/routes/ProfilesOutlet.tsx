import { ProfilesProvider } from "@/context/profiles";
import type { FC } from "react";
import { Outlet, useLocation } from "react-router";

const ProfilesOutlet: FC = () => {
  const { pathname } = useLocation();

  return (
    <ProfilesProvider key={pathname} path={pathname}>
      <Outlet />
    </ProfilesProvider>
  );
};

export default ProfilesOutlet;
