import React , {useState}from 'react';
import { Button } from "primereact/button";

function Clients(props) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState("center");
    return (
      <div>
        <Button
          label="Left"
          icon="pi pi-arrow-right"
          // onClick={() => show("left")}
          className="p-button-help"
          style={{ minWidth: "10rem" }}
        />
      </div>
    );
}

export default Clients;