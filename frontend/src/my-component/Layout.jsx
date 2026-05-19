import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "../my-styles/Layout.css";

function Layout() {

    return (

        <div className="layout">

            <Sidebar />

            <div className="main-content">

                <Outlet />

            </div>

        </div>

    );
}

export default Layout;