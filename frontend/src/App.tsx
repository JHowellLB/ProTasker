import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MostUsed from "./page/mostused";
import Visualization from "./page/visualization";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MostUsed />} />
        <Route path="/visualization" element={<Visualization />} />
      </Routes>
    </Router>
  );
};
export default App;
