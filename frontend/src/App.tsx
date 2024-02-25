import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import MostUsed from "./page/mostused";
import Visualization from "./page/visualization";
import SiteLimit from "./page/sitelimit";
import TaskTimer from "./page/tasktimer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="" element={<MostUsed />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/sitelimit" element={<SiteLimit />} />
        <Route path="/tasktimer" element={<TaskTimer />} />
      </Routes>
    </Router>
  );
};
export default App;
