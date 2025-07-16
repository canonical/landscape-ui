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

interface ThemeContext {
  isDarkMode: boolean;
  set: (value: boolean) => void;
}

const initialValues: ThemeContext = {
  isDarkMode: false,
  set: () => undefined,
};

const ThemeContext = createContext<ThemeContext>(initialValues);

export const useTheme = () => {
  return useContext(ThemeContext);
};

interface ThemeProviderProps {
  readonly children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const getInitial = () => {
    const saved = localStorage.getItem(LS_KEY);
    return saved === "true" || (!saved && systemDark);
  };

  const [isDarkMode, setDarkMode] = useState(getInitial);

  const set = useCallback((value: boolean) => {
    setDarkMode(value);
    localStorage.setItem(LS_KEY, value ? "true" : "false");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-dark", isDarkMode);
    document.body.style.colorScheme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, set }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
