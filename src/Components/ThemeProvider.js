// src/contexts/ThemeContext.js
import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);
  const palettes = {
    default: require('../../assets/Palettes/defaultPalette').default,
    second: require('../../assets/Palettes/secondPalette').default,
    third: require('../../assets/Palettes/thirdPalette').default,
    fourth: require('../../assets/Palettes/fourthPalette').default,
    fifth: require('../../assets/Palettes/fifthPalette').default,
    sixth: require('../../assets/Palettes/sixthPalette').default,
    seventh: require('../../assets/Palettes/seventhPalette').default,
  };

  const theme = palettes[selectedTheme] || palettes.default;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
