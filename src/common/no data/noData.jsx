import React from "react";

function NoData(props) {
  return (
    <div className="noData">
      <h3>Oops,there is no {props.data} ,let's create one </h3>
      <img src="../../../../assets/no-data.avif" alt="no data" />
    </div>
  );
}

export default NoData;
