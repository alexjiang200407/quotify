import "../css/app.css";

import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Pages/Home";

let app = document.getElementById("app");

if (app !== null)
{
    const root = ReactDOM.createRoot(app);
    root.render(
        <React.StrictMode>
            <Home />
        </React.StrictMode>
    );
}