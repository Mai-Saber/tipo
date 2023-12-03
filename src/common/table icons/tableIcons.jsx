import React from 'react';
import { Link } from "react-router-dom";

function TableIcons(props) {
    return (
      <td className="icons">
        {/* edit */}

        <Link className="edit" to="" onClick={() => props.handleEdit(props.item?.id)}>
          <i className="ri-pencil-line"></i>
        </Link>

        {/* delete */}
        <Link
          className="delete"
          to=""
          onClick={() => props.handleDelete(props.item?.id, props.item?.name)}
        >
          <i className="ri-delete-bin-2-fill"></i>
        </Link>
        {/* show */}

        <Link className="show" to="" onClick={() => props.handleShow(props.item?.id)}>
          <i className="ri-eye-line"></i>
        </Link>
      </td>
    );
}

export default TableIcons;