import React from "react";
import "./ApprovedTable.css";

const ApprovedTable = ({ data }) => {
  return (
    <table className="approvedTable">
      <thead>
        <tr>
          <th>Summary</th>
          <th>Suggested On</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            <td>
              <div className="summaryTitle">{item.title}</div>
              <div className="summaryDetaile">
                {item.author}, {item.year} — {item.itemType || "N/A"} (Quantity:{" "}
                {item.quantity}) (Price: {item.currency} {item.price}) ISBN:{" "}
                {item.isbn}
              </div>
            </td>
            <td>{new Date(item.createdAt).toLocaleDateString("en-GB")}</td>
            <td className={item.status==="Approved"?"statusApproved":"statusRejected"}>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApprovedTable;
