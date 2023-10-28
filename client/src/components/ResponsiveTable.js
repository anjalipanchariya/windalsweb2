import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResponsiveTable.css';

const ResponsiveTable = ({ data, columns }) => {
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn] - b[sortColumn];
    } else {
      return b[sortColumn] - a[sortColumn];
    }
  });

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} onClick={() => handleSort(column)}>
                {column}
                {column === sortColumn && (
                  <span className="ml-2">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{item[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;