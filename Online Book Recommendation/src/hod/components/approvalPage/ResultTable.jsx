import React from "react";
import "./ResultTable.css";

const ResultTable = ({ displayData, selected, setSelected }) => {
  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const statusClass = (status) => {
    if (status === "Approved") return "badge badge--approved";
    if (status === "Rejected") return "badge badge--rejected";
    return "badge badge--requested";
  };

  return (
    <div className="tableWrap">
      <table className="hodTable">
        <thead>
          <tr>
            <th className="col-check"></th>
            <th className="col-book">Book Details</th>
            <th className="col-prof">Recommended By</th>
            <th className="col-date">Date</th>
            <th className="col-status">Status</th>
          </tr>
        </thead>

        <tbody>
          {displayData.length === 0 ? (
            <tr>
              <td colSpan="5" className="emptyRow">
                No recommendations found
              </td>
            </tr>
          ) : (
            displayData.map((item) => (
              <tr
                key={item.id}
                className={selected.includes(item.id) ? "row row--selected" : "row"}
              >
                <td className="col-check">
                  <input
                    type="checkbox"
                    disabled={item.status !== "Requested"}
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>

                <td className="col-book">
                  <div className="bookTitle">{item.title}</div>
                  <div className="bookMeta">
                    {item.author}
                    {item.year ? ` · ${item.year}` : ""} · {item.type || item.itemType || "—"}
                    <br />
                    Qty: {item.quantity} &nbsp;·&nbsp; {item.currency} {item.price}
                    &nbsp;·&nbsp; ISBN: {item.isbn}
                  </div>
                </td>

                <td className="col-prof">
                  <div className="profName">
                    {item.recommendedBy?.name || "Unknown"}
                  </div>
                  <div className="profEmail">{item.recommendedBy?.email}</div>
                </td>

                <td className="col-date">
                  {new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </td>

                <td className="col-status">
                  <span className={statusClass(item.status)}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;