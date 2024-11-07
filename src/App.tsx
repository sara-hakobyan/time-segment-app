import { useEffect, useState } from "react";
import "./App.css";
import { MainContent } from "./pages/mainContent";
import { historicalData } from "./staticData/historicalEvents";
import HistoricalDatesComponent from "./pages/mobile";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth <= 780 || window.innerWidth < 450) {
          setIsMobile(true);
        }
        if (window.innerWidth > 780) {
          setIsMobile(false);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth, isMobile]);

  return (
    <div className="app">
      {!isMobile ? (
        <MainContent data={historicalData} />
      ) : (
        <HistoricalDatesComponent data={historicalData} />
      )}
    </div>
  );
}

export default App;
