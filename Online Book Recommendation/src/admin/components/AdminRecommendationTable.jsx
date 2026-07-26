import React from "react";
import "./AdminRecommendationTable.css";

const AdminRecommendationTable = ({ data }) => {
  return (
    <table className="adminTable" id="printTable">
      <thead>
        <tr>
          <th>Summary</th>
          <th>Recommended By</th>
          <th>Department</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="4" className="emptyRow">
              No recommendations found
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id}>
              {/* SUMMARY */}
              <td>
                <div className="title">{item.title}</div>

                {/* Author / Year / Edition */}
                <div className="metaLine">
                  {item.author}
                  {item.year && ` · ${item.year}`}
                  {item.edition && ` · ${item.edition} ed.`}
                </div>

                {/* Course info */}
                {(item.courseCode || item.program) && (
                  <div className="metaLine">
                    {item.courseCode}
                    {item.program && ` · ${item.program}`}
                  </div>
                )}

                {/* Type + Format */}
                <div className="metaLine muted">
                  {item.type} · {item.itemType}
                </div>

                {/* Quantity + Price + ISBN */}
                <div className="metaLine muted">
                  Qty: {item.quantity} · {item.currency} {item.price} · ISBN:{" "}
                  {item.isbn}
                </div>

                {/* Notes (optional) */}
                {item.notes && (
                  <div className="notesInline">
                    “{item.notes}”
                  </div>
                )}
              </td>

              {/* Recommended By */}
              <td>
                <div className="profName">
                  {item.recommendedBy?.name || "N/A"}
                </div>
                <div className="profEmail">
                  {item.recommendedBy?.email}
                </div>
              </td>

              {/* Department */}
              <td>{item.dept || "—"}</td>

              {/* Date */}
              <td>
                {new Date(item.createdAt).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default AdminRecommendationTable;
