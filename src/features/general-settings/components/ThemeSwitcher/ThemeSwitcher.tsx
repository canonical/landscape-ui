import type { Theme } from "@/context/theme";
import { useTheme } from "@/context/theme";
import { Button, Icon } from "@canonical/react-components";
import type { FC, KeyboardEvent } from "react";
import classes from "./ThemeSwitcher.module.scss";

const THEME_OPTIONS: { label: string; value: Theme; icon: string }[] = [
  { label: "System", value: "system", icon: "desktop" },
  { label: "Light", value: "light", icon: "sun" },
  { label: "Dark", value: "dark", icon: "moon" },
];

const LABEL_ID = "theme-switcher-label";
const HELP_ID = "theme-switcher-help";

const ThemeSwitcher: FC = () => {
  const { theme, setTheme } = useTheme();

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = THEME_OPTIONS.findIndex(
      ({ value }) => value === theme,
    );

    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
        break;
      case "ArrowLeft":
        nextIndex =
          (currentIndex - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = THEME_OPTIONS.length - 1;
        break;
      default:
        return;
    }

    const nextOption = THEME_OPTIONS[nextIndex];

    if (!nextOption) {
      return;
    }

    event.preventDefault();
    setTheme(nextOption.value);
    event.currentTarget.querySelectorAll("button")[nextIndex]?.focus();
  };

  return (
    <div className="p-form__group">
      <span className={classes.label} id={LABEL_ID}>
        Theme
      </span>
      <div className="p-segmented-control u-no-margin--bottom">
        <div
          className="p-segmented-control__list"
          role="tablist"
          aria-labelledby={LABEL_ID}
          aria-describedby={HELP_ID}
          onKeyDown={handleListKeyDown}
        >
          {THEME_OPTIONS.map(({ label, value, icon }) => (
            <Button
              key={value}
              type="button"
              role="tab"
              aria-selected={theme === value}
              tabIndex={theme === value ? 0 : -1}
              className="p-segmented-control__button u-no-margin--bottom"
              hasIcon
              onClick={() => {
                setTheme(value);
              }}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>
      <p className={`p-form-help-text ${classes.help}`} id={HELP_ID}>
        Changes are applied and saved automatically.
      </p>
    </div>
  );
};

export default ThemeSwitcher;
