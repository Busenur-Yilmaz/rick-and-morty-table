import axios from "axios";
import React, { useEffect, useState } from "react";
import { usePagination, useTable } from "react-table";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ name: "", species: "", gender: "", status: "" });
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://rickandmortyapi.com/api/character")
      .then((response) => {
        const characters = response.data.results;

  
        const extendedData = Array.from({ length: 10 }, (_, index) =>
          characters.map((char) => ({ ...char, id: `${char.id}-${index}` }))
        ).flat();

        setData(extendedData);
        setFilteredData(extendedData);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data. Please try again.");
      });
  }, []);

  const applyFilters = () => {
    let filtered = data;

    // Sadece dolu olan filtreleri uygulama
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        filtered = filtered.filter((item) =>
          item[key]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    }

    setFilteredData(filtered);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Species",
        accessor: "species",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    gotoPage,
    setPageSize: updatePageSize,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageSize },
    },
    usePagination
  );

  useEffect(() => {
    updatePageSize(pageSize);
  }, [pageSize, updatePageSize]);

  return (
    <div className="App">
      <h1>Rick and Morty Characters</h1>
      {error && <div className="error-message">{error}</div>}

      {/* Filtreleme Arayüzü */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Species"
          value={filters.species}
          onChange={(e) => setFilters({ ...filters, species: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Gender"
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Status"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        />
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      {/* Filtrelenen Tablo Boşsa Mesaj Göster */}
      {filteredData.length === 0 ? (
        <div className="no-results">No characters match your filters.</div>
      ) : (
        <>
          {/* Tablo */}
          <table {...getTableProps()} className="character-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={() => setSelectedCharacter(row.original)}
                    className="clickable-row"
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Sayfalandırma */}
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>
            <span>
              Page {pageOptions.indexOf(page) + 1} of {pageOptions.length}
            </span>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageOptions.length - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>
          </div>

          {/* Seçilen Karakterin Detayları */}
          {selectedCharacter && (
            <div className="character-details">
              <h2>Character Details</h2>
              <p><strong>Name:</strong> {selectedCharacter.name}</p>
              <p><strong>Species:</strong> {selectedCharacter.species}</p>
              <p><strong>Gender:</strong> {selectedCharacter.gender}</p>
              <p><strong>Status:</strong> {selectedCharacter.status}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;