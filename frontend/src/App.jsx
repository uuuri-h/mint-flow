import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./my-pages/Login/Login";
import Home from "./my-pages/Home/Home";
import OrderList from "./my-pages/OrderList/OrderList";
import NewOrder from "./my-pages/NewOrder/NewOrder";
import Layout from "./my-layouts/Layout";
import Setting from "./my-pages/Setting/Setting";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
              // ローカルストレージからトークンを取得
                const token = localStorage.getItem('token'); 

              console.log('取得したトークン:', token); // トークンの値を確認

                const response = await axios.get('http://localhost:8000/users/me/', {
                    headers: {
                      Authorization: `Bearer ${token}` // トークンをAuthorizationヘッダーに含める
                    }
                });
                setUser(response.data);
                // console.log("response.data", response.data);
            } catch (error) {
                console.error('ユーザー情報の取得に失敗しました', error);
            }
        };

    fetchUser();

    }, []); 

    return (
    <BrowserRouter>
    <Routes>

        <Route path="/" element={<Login />} />

        {/* <Route element={<Layout />}> */}
        <Route element={<Layout user={user} />}> {/*ここでuserをlayoutに渡す　*/}

            {/*Layoutの子Routeが Outletに表示される　*/}
            <Route 
                path="/home"
                element={<Home />}
            />

            <Route 
                path="/new-order"
                element={
                    user && user.department_code === "001" ? 
                    <NewOrder /> 
                    : <Home />
                }
            />


            <Route 
                path="/order-list"
                element={<OrderList />}
            />

            <Route 
                path="/setting"
                element={<Setting />}
            />

        </Route>

    </Routes>
    </BrowserRouter>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/home" element={<Home />} />
    //   </Routes>
    // </BrowserRouter>
    );  
}

export default App;

// import React from 'react';
// import './App.css';
// import Login from './my-component/Login';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <Login />
//       </header>
//     </div>
//   );
// }

// export default App;