import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import MainPage from "./pages/MainPage";

function App() {
  const globalStyles = {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={globalStyles}>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
