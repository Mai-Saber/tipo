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
      <Route path="/companies/priceList" element={props.priceListEle} />
      ,
      <Route path="/companies/contacts" element={props.contactsEle} />
      ,
      <Route
        path="/companies/variants/values"
        element={props.variantsValueEle}
      />
      ,
      <Route path="/companies/branches" element={props.branchesEle} />
      ,
      <Route
        path="/companies/branches/wareHouse"
        element={props.wareHouseEle}
      />
      ,
      <Route path="/companies/categories" element={props.categoriesEle} />
      ,
      <Route path="/companies/category/product" element={props.productEle} />
      ,
      <Route
        path="/companies/category/product/finalProduct"
        element={props.finalProductEle}
      />
      ,
      <Route
        path="/companies/category/product/finalProduct/variantValue"
        element={props.finalProductVariantValueEle}
      />
      ,
      <Route
        path="/companies/category/product/finalProduct/images"
        element={props.finalProductImages}
      />
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
