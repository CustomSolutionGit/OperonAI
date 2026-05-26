import { useEffect } from "react";
import Home from "./pages/Home";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <Home />;
}

export default App;
