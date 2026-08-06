import type { FC, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMediaQuery } from "usehooks-ts";

export const LS_KEY = "_landscape_dark_theme";

export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

interface ThemeContext {
  isDarkMode: boolean;
  theme: Theme;
  setTheme: (value: Theme) => void;
}

const initialValues: ThemeContext = {
  isDarkMode: false,
  theme: "system",
  setTheme: () => undefined,
};

export const ThemeContext = createContext<ThemeContext>(initialValues);

export const useTheme = () => {
  return useContext(ThemeContext);
};

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem(LS_KEY);

  // Migrate the legacy boolean values of the dark mode switch
  if (saved === "true") {
    return "dark";
  }

  if (saved === "false") {
    return "light";
  }

  return THEMES.find((theme) => theme === saved) ?? "system";
};

interface ThemeProviderProps {
  readonly children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
    localStorage.setItem(LS_KEY, value);
  }, []);

  const isDarkMode = theme === "dark" || (theme === "system" && systemDark);

  useEffect(() => {
    document.body.classList.toggle("is-dark", isDarkMode);
    document.body.style.colorScheme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
