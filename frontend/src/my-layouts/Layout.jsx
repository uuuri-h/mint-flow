import Sidebar from "../my-component/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import { useEffect } from "react";
import axios from "axios";

function Layout({user}) {

    useEffect(() => {

        // axiosのレスポンスを共通で監視する
        // Interceptor = 途中で処理に割り込むもの
        const interceptor = axios.interceptors.response.use(

            // 正常終了の場合はそのまま返す
            response => response,

            // エラーの場合
            error => {

                // JWTの有効期限切れ・未認証の場合
                if (error.response?.status === 401) {

                    // 保存しているトークンを削除
                    localStorage.removeItem("token");

                    // ログイン画面へ遷移
                    window.location.href = "/";
                }

                alert("ログインの有効期限が切れました。再度ログインしてください。");
                // エラーを呼び出し元へ返す
                return Promise.reject(error);
            }
        );

        // Layoutが破棄されるときにInterceptorを解除する
        // （重複して登録されるのを防ぐ）
        return () => {
            axios.interceptors.response.eject(interceptor);
        };

    }, []);

    return (

        <div className="layout">

            <Sidebar user={user} />

            <div className="main-content">
                <div className="page-inner">
                    {/* この Outlet の位置に、App.jsxでルーティングされたページが入る。 */}
                    {/* <Outlet user={user}/>  */} {/* 直接userを渡すのはできない　（普通の props をそのまま子に流してくれない。）→　useOutletContextで受け取る　*/}
                    <Outlet />
                </div>
            </div>

        </div>

    );
}

export default Layout;