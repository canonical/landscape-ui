import type { FC } from "react";
import { Switch } from "@canonical/react-components";
import { useTheme } from "@/context/theme";

const DarkModeSwitch: FC = () => {
  const { isDarkMode, set } = useTheme();

  return (
    <Switch
      id="dark-mode-switch"
      checked={isDarkMode}
      onChange={() => {
        set(!isDarkMode);
      }}
      label="Dark mode"
    />
  );
};

export default DarkModeSwitch;
