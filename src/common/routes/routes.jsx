import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../Components/login/login";
import App from "../../App";
import NotFound from "../../Components/notFound/notFound";
import Countries from "../../Components/countries/countries";
import Dashboard from "../../Components/dashboard/dashboard";

const AllRoutes = () => {
  return (
    <BrowserRouter basename="">
      <Routes>
        <Route
          path="/"
          element={
            sessionStorage.getItem("token") == null ? <Login /> : <App />
          }
        >
          <Route path="admin-dashboard" element={<Dashboard />} />
          <Route path={"countries"} element={<Countries />} />
          <Route path={"*"} element={<NotFound />} />
          {/* /////////////////////////// */}
          {/* client */}
          <Route path="client-dashboard">
            {/* <Route path="" element={<ClientDashboard />} /> */}

            {/* <Route path={"companies"} element={<ClientCompanies />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
