import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ColorTheme =
  | "purple"
  | "blue"
  | "green"
  | "red"
  | "orange"
  | "pink"
  | "yellow";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("quiz-theme");
    return (saved as Theme) || "dark";
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem("quiz-color-theme");
    return (saved as ColorTheme) || "green";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Remove all theme classes
    root.classList.remove(
      "theme-purple",
      "theme-blue",
      "theme-green",
      "theme-red",
      "theme-orange",
      "theme-pink",
      "theme-yellow"
    );
    root.classList.add(`theme-${colorTheme}`);

    localStorage.setItem("quiz-theme", theme);
    localStorage.setItem("quiz-color-theme", colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colorTheme, setTheme, setColorTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
