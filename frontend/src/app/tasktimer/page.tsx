import Navbar from "../components/Navbar/Navbar";
import { auth, provider } from "../services/firebase";

const TaskTimer = () => {
  return (
    <section>
      <Navbar />
      <div>Task Timer</div>
    </section>
  );
};
export default TaskTimer;
