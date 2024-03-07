import { useContext } from "react";
import { AuthContext } from "@/context/auth";

export default function useAuth() {
  return useContext(AuthContext);
}
