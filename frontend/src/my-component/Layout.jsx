import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "../my-styles/Layout.css";

function Layout() {

    return (

        <div className="layout">

            <Sidebar />

            <div className="main-content">

                <Outlet /> {/* この Outlet の位置に、ルーティングされたページが入る。 */}

            </div>

        </div>

    );
}

export default Layout;