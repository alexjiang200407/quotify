import React from "react";

import { Outlet } from "react-router-dom";

import Header, { HeaderProps } from "../Components/Header";
import { ThemeProvider } from "@emotion/react";
import { Theme } from "@mui/material";

export interface MasterProps {
    theme: Partial<Theme>;
    headerProps: HeaderProps;
};

const Master = (props : MasterProps) => {
    return (
        <div>
            <ThemeProvider theme={props.theme}>
                <Header {...props.headerProps}/>
                <main>
                    <section>
                        <Outlet />
                    </section>
                </main>
            </ThemeProvider>
        </div>
    );
};

export default Master;