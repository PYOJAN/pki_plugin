import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MainBody from "./components/MainBody/MainBody";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      {/* Window top bar */}
      <Header />

      {/* Main content */}
      <MainBody />
      {/* window footer bar */}
      <Footer />
    </div>
  );
};

export default App;
