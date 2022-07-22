import React from "react";
import ReactDOM from "react-dom/client";
import "./css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { Loading } from "notiflix/build/notiflix-loading-aio";

// Initial loder....
Loading.hourglass("Initializing......", {
  backgroundColor: "rgb(0, 0, 0, .9)",
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: "mb-3 py-2",
        duration: 3000,
        style: {
          border: "1px solid #713200",
          color: "#713200",
        },
      }}
    />
    <App />
  </React.StrictMode>
);
