import React, { useState } from "react";
function Layout({ children }) {
    return (
        <>
            <header>
                <div className="logo_box">
                    <img src="./logo.png" alt="" className="logo" />
                    <h1 className="title">Todo App</h1>
                </div>
            </header>
            {children}

        </>
    )
}
export default Layout;