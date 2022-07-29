import { createContext, useState } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MainBody from "./components/MainBody/MainBody";

import "./App.css";

export const AppServiceStatus = createContext();

const App = () => {
  const [isServiceStart, setIsServiceStart] = useState(false);

  return (
    <div className="App">
      {/* Window top bar */}
      <Header />

      {/* Main content */}
      <AppServiceStatus.Provider value={{ isServiceStart, setIsServiceStart }}>
        <MainBody />
      </AppServiceStatus.Provider>
      {/* window footer bar */}
      <Footer />
    </div>
  );
};

export default App;
