import React from "react";

import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Suggest from "./Pages/Suggest";
import Profile from "./Pages/Profile";
import Explore from "./Pages/Explore";

const App = () => {
    return (
        <Routes>
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/suggest" element={<Suggest />} />
                <Route path="/explore" element={<Explore />} />
            </Route>
        </Routes>
    );
};

export default App;