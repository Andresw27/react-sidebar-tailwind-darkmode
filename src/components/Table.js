import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net';

const DataTableExample = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    // Initialize DataTables after component is mounted and table is rendered
    $(tableRef.current).DataTable();

    // Clean up DataTables when component unmounts
    return () => {
      $('.data-table-wrapper')
        .find('table')
        .DataTable()
        .destroy(true);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 data-table-wrapper">
      <h2 className="text-2xl font-bold mb-4">Example Datatable</h2>
      <table ref={tableRef} className="table-auto w-full" id="example">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Position</th>
            <th className="px-4 py-2">Office</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Start date</th>
            <th className="px-4 py-2">Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Tiger Nixon</td>
            <td className="border px-4 py-2">System Architect</td>
            <td className="border px-4 py-2">Edinburgh</td>
            <td className="border px-4 py-2">61</td>
            <td className="border px-4 py-2">2011/04/25</td>
            <td className="border px-4 py-2">$320,800</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableExample;
