import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import { Toaster } from "react-hot-toast";
import AppContextProvider from "./Context/applicationContext";
import { BrowserRouter as Router } from "react-router-dom";
import { toasterOptions } from "./ui/notify";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppContextProvider>
    <Router>
      <App />
    </Router>
    <Toaster position="top-center" toastOptions={toasterOptions} />
  </AppContextProvider>
);
