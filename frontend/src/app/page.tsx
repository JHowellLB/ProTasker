import Navbar from "./components/Navbar/Navbar";
import MainCSS from "./main.module.css";
const MostUsed = () => {
  return (
    <section id="main">
      <Navbar />
      <div className={MainCSS.addWebsite}>Add Website</div>
    </section>
  );
};
export default MostUsed;
