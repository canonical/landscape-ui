import type { NavigateOptions } from "react-router";
import { useLocation, useNavigate } from "react-router";

export default function useNavigateWithSearch() {
  const { search } = useLocation();
  const navigate = useNavigate();

  return (to: string, options?: NavigateOptions) => {
    navigate(`${to}${search}`, options);
  };
}
