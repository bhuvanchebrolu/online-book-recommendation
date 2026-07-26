import React from "react";
import "./PrintApprovedBooks.css";

/**
 * Renders a "Print" button that opens a clean, landscape form-styled
 * printable version of the approved books list — replicating the NITT
 * Central Library "Book Recommendation Form".
 *
 * Props:
 *  - data: array of approved book objects
 *  - user: currently logged-in HOD user object (expects user.name, user.dept)
 *  - department / hodName: optional manual overrides / fallbacks
 *  - academicYear: string (e.g. "2025-26")
 *  - logoUrl: path to institute logo (defaults to "/nitt-logo.png")
 */
const PrintApprovedBooks = ({
  data = [],
  user,
  department,
  hodName,
  academicYear = "2025-26",
  logoUrl = "/nitt-logo.png",
}) => {
  // Prefer live logged-in HOD details; fall back to explicit props, then a generic placeholder.
  const resolvedHodName = user?.name ?? hodName ?? "________________";
  const resolvedDept = user?.department ?? department ?? "________________";

  const buildRows = () =>
    data
      .map((b, i) => {
        const isbn = b.isbn ?? "-";
        const title = b.title ?? "-";
        const author = b.author ?? b.authorEditor ?? "-";
        const publisher = b.publisher ?? "-";
        const year = b.year ?? "-";
        const edition = b.edition ?? "-";
        const qty = b.qty ?? 1;
        const currency = b.currency ?? b.cur ?? "-";
        const price = b.price != null ? b.price : "-";
        const courseCode = b.courseCode ?? "-";
        const category = b.category ?? b.level ?? "-"; // UG/PG/PhD

        return `
          <tr>
            <td class="sl">${i + 1}</td>
            <td class="isbn">${isbn}</td>
            <td class="title">${title}</td>
            <td>${author}</td>
            <td>${publisher}</td>
            <td class="center">${year}</td>
            <td class="center">${edition}</td>
            <td class="center">${qty}</td>
            <td class="center">${currency}</td>
            <td class="center">${price}</td>
            <td class="center">${courseCode}</td>
            <td class="center">${category}</td>
          </tr>`;
      })
      .join("");

  const handlePrint = () => {
    if (!data.length) return;

    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) return; // popup blocked

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Book Recommendation Form - Approved List</title>
          <meta charset="utf-8" />
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: "Segoe UI", Arial, sans-serif;
              color: #1a1a1a;
              margin: 24px 34px;
            }
            .form-header {
              display: flex;
              align-items: center;
              gap: 18px;
              border-bottom: 2px solid #234a85;
              padding-bottom: 14px;
              margin-bottom: 16px;
            }
            .form-header img {
              width: 60px;
              height: 60px;
              object-fit: contain;
            }
            .form-header .titles h1 {
              margin: 0;
              font-size: 18px;
              letter-spacing: 0.4px;
              color: #234a85;
            }
            .form-header .titles h2 {
              margin: 2px 0 0;
              font-size: 14px;
              font-weight: 600;
              color: #333;
            }
            .form-header .titles h3 {
              margin: 4px 0 0;
              font-size: 12.5px;
              font-weight: 500;
              color: #555;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
              font-size: 12.5px;
              margin-bottom: 14px;
              padding: 7px 12px;
              background: #f4f6fb;
              border-radius: 6px;
              border: 1px solid #dfe4ee;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin-bottom: 24px;
              table-layout: fixed;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 5px 6px;
              text-align: left;
              vertical-align: top;
              overflow-wrap: break-word;
            }
            th {
              background: #234a85;
              color: #fff;
              font-weight: 600;
              font-size: 10.5px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            td.center { text-align: center; }
            td.sl { text-align: center; width: 26px; }
            td.isbn { width: 95px; }
            td.title { font-weight: 600; width: auto; }
            tr:nth-child(even) { background: #fafbfd; }

            .signature-block {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
              font-size: 13px;
              page-break-inside: avoid;
            }
            .signature-block .sig-line {
              margin-top: 40px;
              border-top: 1px solid #333;
              width: 220px;
              padding-top: 4px;
            }
            .guidelines {
              margin-top: 34px;
              padding-top: 12px;
              border-top: 1px dashed #999;
              font-size: 10px;
              color: #444;
              line-height: 1.45;
              page-break-inside: avoid;
            }
            .guidelines h4 {
              margin: 0 0 6px;
              font-size: 11px;
              color: #234a85;
            }
            .guidelines ul {
              margin: 0;
              padding-left: 18px;
            }
            @media print {
              @page {
                size: landscape;
                margin: 12mm;
              }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="form-header">
            <img src="${logoUrl}" onerror="this.style.display='none'" alt="NIT Trichy" />
            <div class="titles">
              <h1>NATIONAL INSTITUTE OF TECHNOLOGY, Tiruchirappalli - 15</h1>
              <h2>Central Library</h2>
              <h3>Book Recommendation Form — Approved List (${academicYear})</h3>
            </div>
          </div>

          <div class="meta-row">
            <span><strong>Department:</strong> ${resolvedDept}</span>
            <span><strong>Total Approved:</strong> ${data.length}</span>
            <span><strong>Generated:</strong> ${new Date().toLocaleDateString(
              "en-IN",
            )}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author/Editor</th>
                <th>Publisher</th>
                <th>Year</th>
                <th>Ed.</th>
                <th>Qty</th>
                <th>Cur</th>
                <th>Price</th>
                <th>Course Code</th>
                <th>UG/PG/PhD</th>
              </tr>
            </thead>
            <tbody>
              ${buildRows()}
            </tbody>
          </table>

          <div class="signature-block">
            <div>
              <div class="sig-line">Signature of the HOD with Date</div>
            </div>
            <div>
              <div><strong>Name of the HOD:</strong> ${resolvedHodName}</div>
              <div><strong>Department:</strong> ${resolvedDept}</div>
            </div>
          </div>

          
        </body>
      </html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <button
      className="print-approved-btn"
      onClick={handlePrint}
      disabled={!data.length}
      title={
        !data.length ? "No approved books to print" : "Print approved list"
      }
    >
      🖨️ Print Approved List
    </button>
  );
};

export default PrintApprovedBooks;
