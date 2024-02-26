// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tabs from "./components/Tabs/Tabs";
import Login from "./components/Login/Login";
// import MostUsed from "./page/mostused";
// import Visualization from "./page/visualization";
// import SiteLimit from "./page/sitelimit";
// import TaskTimer from "./page/tasktimer";
// import Navbar from "./Navbar/Navbar";
import { useState, useEffect } from "react";
import { auth } from "./services/firebase";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        // User is signed in, update state with user data
        setUser(user);
      } else {
        // No user is signed in, update state to indicate no user
        setUser(null);
      }
    });

    // Cleanup function to unsubscribe from the observer when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array to run effect only once when component mounts

  return <div>{user ? <Tabs /> : <Login />} </div>;
};
export default App;
