import Sidebar from "../my-component/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

function Layout({user}) {

    return (

        <div className="layout">

            <Sidebar user={user} />

            <div className="main-content">

                <Outlet /> {/* この Outlet の位置に、ルーティングされたページが入る。 */}

            </div>

        </div>

    );
}

export default Layout;