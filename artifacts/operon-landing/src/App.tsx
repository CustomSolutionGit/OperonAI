import { useEffect } from "react";
import Home from "./pages/Home";
import { initAnalytics } from "./lib/analytics";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    initAnalytics();
  }, []);

  return <Home />;
}

export default App;
