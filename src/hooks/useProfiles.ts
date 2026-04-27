import { useContext } from "react";
import { ProfilesContext } from "@/context/profiles";

export default function useProfilesContext() {
  return useContext(ProfilesContext);
}
