import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import OptionsPage from "./OptionsPage";
import SettingsPage from "./SettingsPage";
import OthersPage from "./OthersPage";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<OptionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/others" element={<OthersPage />} />
      </Routes>
    </div>
  );
};

export default App;
