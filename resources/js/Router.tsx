import React from "react";

import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Suggest from "./Pages/Suggest";
import Profile from "./Pages/Profile";
import Explore from "./Pages/Explore";
import Master from "./Layouts/Master";
import { createDefaultTheme } from "./Themes/DefaultTheme";

const headerProps = {
    pages: [
        {
            label: "Home",
            link: "/spa/"
        },
        {
            label: "Profile",
            link: "/spa/profile"
        },
        {
            label: "Suggest",
            link: "/spa/suggest"
        },
        {
            label: "Explore",
            link: "/spa/explore"
        },
        {
            label: "Login",
            link: "/spa/login"
        },
    ]
}

const App = () => {
    return (
        <Routes>
            <Route
                path="/spa/"
                element={<Master headerProps={headerProps} theme={createDefaultTheme()}/>}
            >
                <Route index element={<Home />} />
                <Route path="/spa/login" element={<Login />} />
                <Route path="/spa/profile" element={<Profile />} />
                <Route path="/spa/suggest" element={<Suggest />} />
                <Route path="/spa/explore" element={<Explore />} />
            </Route>
        </Routes>
    );
};

export default App;