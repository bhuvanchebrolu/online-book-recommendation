import React, { useState, useRef, useEffect } from "react";
import "./recommendTable.css";
import { useMessage } from "../../context/MessageContext";
import api from "../../utils/axios";

const TABS = ["All", "Requested", "Approved", "Rejected"];

const STATUS_BADGE = {
  Requested: { cls: "stReq", icon: "⏱" },
  Approved:  { cls: "stApp", icon: "✓" },
  Rejected:  { cls: "stRej", icon: "✕" },
};

const TAB_COUNT_CLS = {
  All:       "tcAll",
  Requested: "tcReq",
  Approved:  "tcApp",
  Rejected:  "tcRej",
};

const RecommendTable = ({ recommendations, setRecommendations }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const { showMessage } = useMessage();
  const masterRef = useRef(null);

  const filtered =
    activeTab === "All"
      ? recommendations
      : recommendations.filter((r) => r.status === activeTab);

  const selectedInView = filtered.filter((r) => selectedIds.includes(r.id));
  const allViewSelected =
    filtered.length > 0 && selectedInView.length === filtered.length;
  const someViewSelected =
    selectedInView.length > 0 && !allViewSelected;

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.indeterminate = someViewSelected;
    }
  }, [someViewSelected]);

  const tabCount = (tab) =>
    tab === "All"
      ? recommendations.length
      : recommendations.filter((r) => r.status === tab).length;

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedIds([]);
  };

  const toggleOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const masterToggle = (checked) => {
    if (checked) {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...filtered.map((r) => r.id)]),
      ]);
    } else {
      const viewIds = new Set(filtered.map((r) => r.id));
      setSelectedIds((prev) => prev.filter((id) => !viewIds.has(id)));
    }
  };

  const toggleSelAll = () => {
    allViewSelected ? masterToggle(false) : masterToggle(true);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.length} recommendation(s)? This cannot be undone.`
      )
    )
      return;

    api
      .delete("/api/recommend", { data: { ids: selectedIds } })
      .then(() => {
        setRecommendations((prev) =>
          prev.filter((r) => !selectedIds.includes(r.id))
        );
        setSelectedIds([]);
        showMessage("Deleted successfully", "success");
      })
      .catch((err) => {
        console.log(err);
        showMessage("Delete failed", "error");
      });
  };

  const formatDate = (iso) => {
    if (!iso) return { day: "—", year: "" };
    const d = new Date(iso);
    return {
      day: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      year: d.getFullYear(),
    };
  };

  return (
    <div className="rtWrap">
      {/* Tabs */}
      <div className="rtTabBar">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`rtTab${activeTab === tab ? " rtTab--active" : ""}`}
            onClick={() => switchTab(tab)}
          >
            {tab}
            <span className={`rtTabCount ${TAB_COUNT_CLS[tab]}`}>
              {tabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rtToolbar">
        <div className="rtToolbar__left">
          {selectedIds.length > 0 && (
            <span className="rtSelPill">{selectedIds.length} selected</span>
          )}
        </div>
        <div className="rtToolbar__right">
          <button className="rtBtn" onClick={toggleSelAll}>
            {allViewSelected ? "Deselect all" : "Select all"}
          </button>
          {selectedIds.length > 0 && (
            <button className="rtBtn rtBtn--danger" onClick={handleDelete}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Delete selected
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rtTableWrap">
        <table className="rtTable">
          <thead>
            <tr>
              <th className="col-chk">
                <input
                  type="checkbox"
                  ref={masterRef}
                  checked={allViewSelected}
                  onChange={(e) => masterToggle(e.target.checked)}
                  aria-label="Select all"
                />
              </th>
              <th className="col-sum">Book summary</th>
              <th className="col-dat">Submitted on</th>
              <th className="col-dep">Department</th>
              <th className="col-sta">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="rtEmpty">
                  <div className="rtEmptyInner">
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span>
                      No{" "}
                      {activeTab === "All"
                        ? "recommendations"
                        : `${activeTab.toLowerCase()} requests`}{" "}
                      found
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((rec) => {
                const dt = formatDate(rec.createdAt);
                const isSelected = selectedIds.includes(rec.id);
                const tags = [rec.type, rec.itemType, rec.level].filter(Boolean);
                const qtyMeta = `Qty ${rec.quantity}${
                  rec.currency ? ` · ${rec.currency} ${rec.price}` : ""
                }`;
                const badge = STATUS_BADGE[rec.status] || STATUS_BADGE.Requested;

                return (
                  <tr
                    key={rec.id}
                    className={`rtRow${isSelected ? " rtRow--sel" : ""}`}
                    onClick={() => toggleOne(rec.id)}
                  >
                    <td
                      className="col-chk"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(rec.id)}
                        aria-label={`Select ${rec.title}`}
                      />
                    </td>

                    <td className="col-sum">
                      <div className="sTitle">{rec.title}</div>
                      <div className="sMeta">
                        {rec.author}
                        {rec.year && (
                          <>
                            <span className="metaSep">·</span>
                            {rec.year}
                          </>
                        )}
                        {rec.edition && (
                          <>
                            <span className="metaSep">·</span>
                            {rec.edition} ed.
                          </>
                        )}
                      </div>
                      <div className="sTags">
                        {tags.map((t) => (
                          <span key={t} className="sTag">{t}</span>
                        ))}
                        <span className="sTag">{qtyMeta}</span>
                        {rec.isbn && (
                          <span className="sTag sTagMono">{rec.isbn}</span>
                        )}
                        {rec.courseCode && (
                          <span className="sTag">Course: {rec.courseCode}</span>
                        )}
                      </div>
                      {rec.notes && (
                        <div className="sNotes">{rec.notes}</div>
                      )}
                    </td>

                    <td className="col-dat">
                      <div className="dateDay">{dt.day}</div>
                      <div className="dateYear">{dt.year}</div>
                    </td>

                    <td className="col-dep">
                      {rec.dept?.trim() ? (
                        <span className="deptBadge">{rec.dept}</span>
                      ) : (
                        <span className="deptBadge deptBadge--missing">
                          Not set
                        </span>
                      )}
                    </td>

                    <td className="col-sta">
                      <span className={`stBadge ${badge.cls}`}>
                        <span className="stIcon">{badge.icon}</span>
                        {rec.status}
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

export default RecommendTable;