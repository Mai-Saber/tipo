import { ToastContainer } from 'react-toastify';
import './App.css';
import Login from './Components/login/login';
import "bootstrap/dist/css/bootstrap.min.css";
import "toastify-js/src/toastify.css";
import NavBar from "./Components/nav bar/navbar";
import SideBar from "./Components/side bar/sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./Components/countries/countries";
import User from "./Components/user/user";
import Countries from './Components/countries/countries';

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/" exact element={<Login />} />
          </Routes>
          {sessionStorage.getItem("token") && <NavBar />}
          {/* ///////////////*/}
          <div className="layout">
            {sessionStorage.getItem("token") && <SideBar />}
            <main className="main">
              <Routes>
                {/* <Route path="/" exact element={<Login />} /> */}
                <Route path="/countries" element={<Countries />} />,
                <Route path="/user" element={<User />} />,
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
