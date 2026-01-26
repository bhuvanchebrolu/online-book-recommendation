import React, { useState } from "react";
import axios from "axios";
import "./recommendTable.css";
import { useMessage } from "../../context/MessageContext";

const RecommendTable = ({ recommendations, setRecommendations }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const {showMessage}=useMessage();
  const selectAll = () => {
    setSelectedIds(recommendations.map((r) => r._id));
    showMessage("Selected all");
  };

  const clearAll = () => {
    setSelectedIds([]);
    showMessage("Cleared all selected recommendation");
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm("Are you sure you want to delete selected recommendations?"))
      return;
    showMessage("Deleted recommendations selected","success")
    axios
      .delete("http://localhost:8080/api/recommend", {
        data: { ids: selectedIds },
      })
      .then(() => {
        // Only ONE source of truth — update parent state
        setRecommendations((prev) =>
          prev.filter((rec) => !selectedIds.includes(rec._id))
        );

        setSelectedIds([]);
      })
      .catch((err) => {
        console.log(err);
        showMessage(err,"error");
      });
  };

  return (
    <div className="recDiv">
      <div className="tableActions">
        <button onClick={selectAll}>Select All</button>
        <button onClick={clearAll}>Clear All</button>
        <button onClick={handleDelete} disabled={selectedIds.length === 0}>
          Delete Selected
        </button>
      </div>

      <table className="recTable">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  recommendations.length > 0 &&
                  selectedIds.length === recommendations.length
                }
                onChange={(e) => {
                  if (e.target.checked) selectAll();
                  else clearAll();
                }}
              />
            </th>
            <th>Summary</th>
            <th>Suggested On</th>
            <th>Department</th>
          </tr>
        </thead>

        <tbody>
          {recommendations.length === 0 ? (
            <tr>
              <td colSpan="4" className="emptyRow">
                No recommendations found.
              </td>
            </tr>
          ) : (
            recommendations.map((rec) => (
              <tr key={rec._id}>
                {/* CHECKBOX */}
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(rec._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, rec._id]);
                      } else {
                        setSelectedIds(
                          selectedIds.filter((id) => id !== rec._id)
                        );
                      }
                    }}
                  />
                </td>

                {/* SUMMARY */}
                <td>
                  <div className="summaryTitle">{rec.title}</div>
                  <div className="summaryDetails">
                    {rec.author}, {rec.year} — {rec.itemType || "N/A"}{" "}
                    (Quantity: {rec.quantity}) (Price: {rec.currency}{" "}
                    {rec.price})
                  </div>
                </td>

                {/* DATE */}
                <td>
                  {rec.createdAt
                    ? new Date(rec.createdAt).toLocaleDateString("en-GB")
                    : "--"}
                </td>

                {/* DEPARTMENT */}
                <td
                  className={
                    rec.dept?.trim() ? "deptCell" : "deptCell isEmpty"
                  }
                >
                  {rec.dept?.trim() || "*"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendTable;
