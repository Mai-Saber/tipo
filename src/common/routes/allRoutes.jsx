import React from "react";
import { Route, Routes } from "react-router-dom";

function AllRoutes(props) {
  return (
    <Routes>
      <Route path="/countries" element={props.countriesEle} />
      ,
      <Route path="/governorate" element={props.governorateEle} />
      ,
      <Route path="/companies" element={props.companiesEle} />
      ,
      <Route path="/companies/variants" element={props.variantsEle} />
      ,
      <Route path="/companies/branches" element={props.branchesEle} />
      ,
      <Route path="/companies/categories" element={props.categoriesEle} />
      ,
      <Route path="/users" element={props.userEle} />
      ,
      <Route path="/clients" element={props.clientsEle} />
      ,
      <Route path="*" element={props.notFoundEle} />
    </Routes>
  );
}

export default AllRoutes;
