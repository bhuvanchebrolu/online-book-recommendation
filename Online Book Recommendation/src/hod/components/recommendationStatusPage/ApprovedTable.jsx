import React, { useState } from "react";
import "./ApprovedTable.css";

const ApprovedTable = ({ data = [] }) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All" ? data : data.filter((d) => d.status === activeFilter);

  const total = filtered.length;
  const approved = filtered.filter((d) => d.status === "Approved").length;
  const rejected = filtered.filter((d) => d.status === "Rejected").length;

  const formatDate = (iso) => {
    if (!iso) return { day: "--", year: "" };
    const d = new Date(iso);
    return {
      day: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      year: d.getFullYear(),
    };
  };

  const badgeClass = (status) => {
    if (status === "Approved") return "badge badgeApproved";
    if (status === "Rejected") return "badge badgeRejected";
    return "badge badgePending";
  };

  const badgeIcon = (status) => {
    if (status === "Approved") return "✓";
    if (status === "Rejected") return "✕";
    return "◷";
  };

  return (
    <div className="atWrap">
      {/* Top bar */}
      <div className="topBar">
        <div className="topBarLeft">
          <h2>Purchase requests</h2>
          <p className="subtitle">Library acquisition workflow</p>
        </div>
        <div className="filterRow">
          {["All", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              className={`pillBtn${activeFilter === f ? " pillBtnActive" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="statsRow">
        <div className="statCard">
          <div className="statLabel">Total requests</div>
          <div className="statValue">{total}</div>
          <div className="statSub">across all faculties</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Approved</div>
          <div className="statValue statApproved">{approved}</div>
          <div className="statSub">ready to procure</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Rejected</div>
          <div className="statValue statRejected">{rejected}</div>
          <div className="statSub">review recommended</div>
        </div>
      </div>

      {/* Table */}
      <div className="tableWrap">
        <table className="approvedTable">
          <thead>
            <tr>
              <th>Summary</th>
              <th>Suggested on</th>
              <th className="thRight">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="emptyCell">
                  No requests found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const dt = formatDate(item.createdAt);
                const meta = [
                  item.courseCode,
                  item.program && `· ${item.program}`,
                ]
                  .filter(Boolean)
                  .join(" ");
                const typeMeta = `${item.type || "General"} · ${
                  item.itemType || "N/A"
                }`;
                const qtyMeta = `Qty ${item.quantity} · ${item.currency} ${item.price}`;

                return (
                  <tr key={item.id}>
                    {/* Summary */}
                    <td>
                      <div className="tTitle">{item.title}</div>
                      <div className="tAuthor">
                        {item.author}
                        {item.year && ` · ${item.year}`}
                        {item.edition && ` · ${item.edition} ed.`}
                      </div>
                      <div className="tags">
                        {meta && <span className="tag">{meta}</span>}
                        <span className="tag">{typeMeta}</span>
                        <span className="tag">{qtyMeta}</span>
                        <span className="tag tagMono">{item.isbn}</span>
                      </div>
                      {item.notes && (
                        <div className="tNotes">{item.notes}</div>
                      )}
                      {item.recommendedBy?.name && (
                        <div className="tMeta">
                          👤 {item.recommendedBy.name}
                          {item.dept && ` · ${item.dept}`}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td>
                      <div className="dateBlock">
                        <div className="dateDay">{dt.day}</div>
                        <div className="dateYear">{dt.year}</div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="tdRight">
                      <span className={badgeClass(item.status)}>
                        <span className="badgeIcon">{badgeIcon(item.status)}</span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedTable;