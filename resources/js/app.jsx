import "./bootstrap";
import "../css/app.css";

import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Pages/Home";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <React.StrictMode>
        <Home />
    </React.StrictMode>
);