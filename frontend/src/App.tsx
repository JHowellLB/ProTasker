import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MostUsed from "./page/mostused";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MostUsed />} />
      </Routes>
    </Router>
  );
};
export default App;
