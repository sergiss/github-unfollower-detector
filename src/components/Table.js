import React from "react";
import { useState } from "react";

function Table({ columns, rows }) {

  const [ rowsPerPage, setRowsPerPage ] = useState(7);
  const [ page, setPage ] = useState(1);

  const maxPages = Math.ceil(rows.length/rowsPerPage);

  let sortColumn = "id";

  var sortedRows = rows.sort((a, b) => {
    let v1 = a[sortColumn];
    let v2 = b[sortColumn];
    if(v1 === v2) return 0;
    return v1 < v2 ? -1 : 1
  })
  const start = (page - 1) * rowsPerPage;
  const end   = start + rowsPerPage;
  var computedRows = sortedRows.slice(start, end);  
 
  const navigatePage = (e)=> {
    if(e.target.value === "Next") {
        setPage(Math.min(maxPages, page + 1))
    } else if(e.target.value === "Previous") {
        setPage(Math.max(1, page - 1))
    }
  }

  return (
    <div className="table-container">   

      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" style={column.style}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {computedRows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.id}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-navigation">
          <input type="button" name="previous" value="Previous" onClick={(e)=>navigatePage(e)}/>
          <label>{page} / {maxPages}</label>
          <input type="button" name="next" value="Next" onClick={(e)=>navigatePage(e)}/>
      </div>
    
    </div>
  );
}

export default Table;
