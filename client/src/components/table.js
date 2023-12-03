import React, { useState } from 'react';
import './table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSolid, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import exportimg from '../images/export.png'; 
import {Dropdown, DropdownButton} from 'react-bootstrap'
import jsPDF from 'jspdf';
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

function Table({ columns, data }) {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');

  // Sorting function
  const sortByColumn = (columnName) => {
    if (sortedColumn === columnName) {
      // Toggle sorting direction if the same column is clicked again
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending order when sorting a new column
      setSortedColumn(columnName);
      setSortDirection('asc');
    }
  };

  // Filtering function
  const filterData = () => {
    return data.filter((row) => {
      if (!filterColumn || !filterValue) return true;

      const cellValue = row[filterColumn];
      return cellValue && cellValue.toString().toLowerCase().includes(filterValue.toLowerCase());
    });
  };

  // Apply sorting and filtering
  const filteredData = filterData().sort((a, b) => {
    if (sortedColumn) {
      const aValue = a[sortedColumn];
      const bValue = b[sortedColumn];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return bValue > aValue ? 1 : -1;
      }
    }
    return 0;
  });

  const exportToCSV = () => {

    let csv = '';
    const arr = []

    for (let j = 0; j < columns.length; j++) {
      arr.push(columns[j]['label'])
    }

    console.log(arr);
    console.log(columns);

    csv += arr.join(',') + '\n';
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      // const values = columnKeys.map(key => row[key]);
      const values = Object.values(row);
      csv += values.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'table_data.csv';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  console.log(columns);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Table Data", 10, 10);

    const tableData = [];
    tableData.push(columns.map((col) => col.label));
    filteredData.forEach((row) => {
      tableData.push(columns.map((col) => row[col.field]));
    });

    doc.autoTable({
      head: tableData.slice(0,1),
      body: tableData.slice(1),
    });

    doc.save("table_data.pdf")
  }

  const exportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table_data.xlsx';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="table-container">
      
      <div className="filter-section">
      <div className="search-container">
        <input class="search expandright" id="searchright" type="search" name="q" placeholder="Filter Value" value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}/>
        <label class="button searchbutton" for="searchright"><span class="mglass">&#9906;</span></label>
      </div>
        <div className='box'>
          <select
            onChange={(e) => setFilterColumn(e.target.value)}
            value={filterColumn}
          >
            <option value="">Select Column</option>
            {columns.map((col) => (
              <option key={col.field} value={col.field}>
                {col.label}
              </option>
            ))}
          </select>
        </div>
        <div className='export'>
            {/* <img src={exportimg} alt="" onClick={exportToCSV}/> */}.
            <Dropdown >
              <Dropdown.Toggle variant='light' style={{backgroundColor:'#d1cbcb', height:'4.6vh', marginLeft:6, borderRadius:0}}>
                Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
              <button style = {{backgroundColor:'white', color:'black'}} onClick={exportToCSV}>
                  Export to CSV 
                </button>
                <button style = {{backgroundColor:'white', color:'black' }} onClick={exportToPDF}>
                  Export to PDF
                </button>
                <button style = {{backgroundColor:'white', color:'black'}} onClick={exportToXLSX}>
                  Export to XLSX
                </button>
              </Dropdown.Menu>
            </Dropdown>

        </div>
      </div>

      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field}>
                {col.label}{' '}
                {sortedColumn === col.field ? (
                  sortDirection === 'asc' ? (
                    <span className="sort-arrow" onClick={() => sortByColumn(col.field)}>▲</span>
                  ) : (
                    <span className="sort-arrow" onClick={() => sortByColumn(col.field)}>▼</span>
                  )
                ) : (
                  <span className="sort-arrow" onClick={() => sortByColumn(col.field)}>↕</span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              {

                columns.map((col) => (

                  <td key={col.field}>{row[col.field]}</td>
                ))
              }
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      {/* <button onClick={exportToCSV}>Export to CSV</button> */}
    </div>
  );
}

export default Table;
