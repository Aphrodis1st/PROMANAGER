import React, { useState, useMemo } from "react";

const DataTable = ({
  columns,
  data = [],
  pageSize = 10,
  onRowClick,
}) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [direction, setDirection] = useState("asc");
  const [page, setPage] = useState(1);

  // Search
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, direction]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginated = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSort = (key) => {
    setDirection(sortKey === key && direction === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 px-4 py-2 border rounded-xl w-full dark:bg-gray-800"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 dark:text-gray-300">
            {columns.map((col) => (
              <th
                key={col.key || col.accessor}
                className="py-3 cursor-pointer"
                onClick={() => handleSort(col.key || col.accessor)}
              >
                {col.label || col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginated.map((row, i) => (
            <tr 
              key={row.id || i} 
              className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={`${row.id || i}-${col.key || col.accessor}`} className="py-3">
                  {col.render
                    ? col.render(row)
                    : row[col.key || col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export { DataTable };
export default DataTable;