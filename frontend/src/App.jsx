import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./my-pages/Login/Login";
import Home from "./my-pages/Home/Home";
import OrderList from "./my-pages/OrderList/OrderList";
import NewOrder from "./my-pages/NewOrder/NewOrder";
import Layout from "./my-layouts/Layout";
import Setting from "./my-pages/Setting/Setting";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>

            {/*Layoutの子Routeが Outletに表示される　*/}
            <Route 
                path="/home"
                element={<Home />}
            />
            <Route 
                path="/new-order"
                element={<NewOrder />}
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