import Sidebar from "../my-component/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

function Layout({user}) {

    return (

        <div className="layout">

            <Sidebar user={user} />

            <div className="main-content">

                {/* この Outlet の位置に、ルーティングされたページが入る。 */}
                {/* <Outlet user={user}/>  */} {/* 直接userを渡すのはできない　（普通の props をそのまま子に流してくれない。）→　useOutletContextで受け取る　*/}
                <Outlet context={{ user }} />
            </div>

        </div>

    );
}

export default Layout;