import React, { useEffect, useState } from "react";
import TopButtons from "../components/approvalPage/TopButtons";
import SearchBar from "../components/approvalPage/SearchBar";
import ResultTable from "../components/approvalPage/ResultTable";
import BottomActions from "../components/approvalPage/BottomActions";
import "./ApprovalPage.css";
import ConfirmModal from "../components/approvalPage/ConfirmModal";
import { useMessage } from "../../context/MessageContext";
import api from "../../utils/axios";

const ApprovalPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  const { showMessage } = useMessage();

  useEffect(() => {
    api
      .get("/api/recommend/pending")
      .then((res) => {
        setData(res.data);
        setFiltered(res.data);
        showMessage("Pending recommendations fetched", "success");
      })
      .catch(() => showMessage("Failed to fetch recommendations", "error"));
  }, []);

  const selectAll = () => {
    setSelected(filtered.map((item) => item.id));
    showMessage("Selected all", "success");
  };
  const clearAll = () => {
    setSelected([]);
    showMessage("Cleared selection", "success");
  };
  const displayAll = () => {
    setShowAll(true);
    showMessage("Showing all recommendations");
  };

  const handleSearch = () => {
    const s = search.toLowerCase();
    setFiltered(
      data.filter(
        (item) =>
          item.title?.toLowerCase().includes(s) ||
          item.author?.toLowerCase().includes(s) ||
          item.itemType?.toLowerCase().includes(s) ||
          item.dept?.toLowerCase().includes(s) ||
          item.recommendedBy?.name?.toLowerCase().includes(s),
      ),
    );
    showMessage("Filtered successfully", "success");
  };

  const clearSearch = () => {
    setSearch("");
    setFiltered(data);
    showMessage("Filter cleared");
  };

  const openModal = (action) => {
    if (selected.length === 0) {
      showMessage("Please select at least one book", "error");
      return;
    }
    setModalAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await api.put("/api/recommend/update-status", {
        ids: selected.map(Number),
        status: modalAction === "approve" ? "Approved" : "Rejected",
      });
      showMessage("Status updated successfully", "success");
      const res = await api.get("/api/recommend/pending");
      setData(res.data);
      setFiltered(res.data);
      setSelected([]);
    } catch {
      showMessage("Failed to update status", "error");
    }
    setModalOpen(false);
  };

  const displayData = showAll ? filtered : filtered.slice(0, 10);

  return (
    <div className="hodContainer">
      <h2>Online Book Recommendations</h2>
      <p className="pageSubtitle">Pending approvals for your department</p>

      <TopButtons
        selectAll={selectAll}
        clearAll={clearAll}
        displayAll={displayAll}
        filtered={filtered}
      />
      <SearchBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        data={data}
      />
      <ResultTable
        displayData={displayData}
        selected={selected}
        setSelected={setSelected}
      />
      <BottomActions
        onApprove={() => openModal("approve")}
        onReject={() => openModal("reject")}
        selectedCount={selected.length}
      />

      <ConfirmModal
        open={modalOpen}
        title={
          modalAction === "approve"
            ? "Approve these recommendations?"
            : "Reject these recommendations?"
        }
        books={filtered.filter((b) => selected.includes(b.id))}
        confirmText={modalAction === "approve" ? "Yes, approve" : "Yes, reject"}
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ApprovalPage;
