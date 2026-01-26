// COPY TO CLIPBOARD
export const copyTableData = (data) => {
  const text = data
    .map(
      (item) =>
        `${item.title} | ${item.author} | ${item.itemType} | Qty: ${item.quantity} | Price: ${item.price} | ISBN: ${item.isbn} | Dept: ${item.dept}`
    )
    .join("\n");

  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!");
};

// EXPORT CSV
export const downloadCSV = (data) => {
  const csvRows = [];

  const headers = [
    "Title",
    "Author",
    "Type",
    "Quantity",
    "Price",
    "ISBN",
    "Department",
    "Suggested On",
    "Status",
  ];
  csvRows.push(headers.join(","));

  data.forEach((item) => {
    const row = [
      item.title,
      item.author,
      item.itemType,
      item.quantity,
      item.price,
      item.isbn,
      item.dept,
      item.createdAt,
      item.status,
    ];
    csvRows.push(row.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "recommendations.csv";
  a.click();
};

// PRINT
export const printTable = () => {
  window.print();
};
