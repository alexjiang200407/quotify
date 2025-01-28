import "../css/app.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Router"
import { BrowserRouter } from "react-router-dom";

let app = document.getElementById("app");

if (app !== null)
{
    const root = ReactDOM.createRoot(app);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
}