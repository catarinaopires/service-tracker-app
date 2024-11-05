import { createContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

const ThemeContext = createContext({
  theme: Colors.light,
  changeTheme: (theme) => Colors[theme],
});

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(Colors[colorScheme || "light"]);

  useEffect(() => {
    setTheme(Colors[colorScheme || "light"]);
  }, [colorScheme]);

  const changeTheme = (newTheme) => {
    setTheme(Colors[newTheme]);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
