export function parseTablesArrayToJSON(tableStrings = [{}, {}]) {
  // Function to parse a single table
  const parseTable = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const table = doc.querySelector("table");
    if (!table) return [];

    // Extract headers
    const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
      th.textContent.trim()
    );

    // Fallback: first row as headers
    if (headers.length === 0) {
      const firstRow = table.querySelector("tr");
      if (firstRow) {
        firstRow.querySelectorAll("td, th").forEach((cell) => {
          headers.push(cell.textContent.trim());
        });
      }
    }

    // Extract rows
    const rows = Array.from(
      table.querySelectorAll("tbody tr, tr:not(thead tr)")
    );

    // Convert rows to objects
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td")).map((td) =>
        td.textContent.trim()
      );
      const rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header || `Column ${index + 1}`] = cells[index] || "";
      });
      return rowObject;
    });
  };

  // Parse all tables
  let allData = [];
  tableStrings.forEach((tableHTML) => {
    const tableData = parseTable(tableHTML);
    allData = allData.concat(tableData);
  });

  console.log("allData", allData);
  return allData;
}
