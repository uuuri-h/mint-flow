import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./my-component/Login";
import Home from "./my-component/Home";
import Layout from "./my-component/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>

            <Route
                path="/home"
                element={<Home />}
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