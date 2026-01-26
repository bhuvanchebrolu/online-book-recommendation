import React, { useEffect, useState } from "react";
import axios from "axios";
import TopButtons from "../components/approvalPage/TopButtons";
import SearchBar from "../components/approvalPage/SearchBar";
import ResultTable from "../components/approvalPage/ResultTable";
import BottomActions from "../components/approvalPage/BottomActions";

import "./ApprovalPage.css";
import ConfirmModal from "../components/approvalPage/ConfirmModal";
import { useMessage } from "../../context/MessageContext";

const ApprovalPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  const {showMessage}=useMessage();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/recommend/pending")
      .then((res) => {
        setData(res.data);
        setFiltered(res.data);
        showMessage("Pending recommendations fetched","success");
      })
      .catch((err) => {
        console.log(err);
        showMessage(err,"error");
      });
  }, []);

  const selectAll = () => {
    setSelected(filtered.map((item) => item._id));
    showMessage("Selected All","success");
  };

  const clearAll = () => {
    setSelected([]);
    showMessage("Cleared All","success");
  };

  const displayAll = () => {
    setShowAll(true);
    showMessage("All the recommendations fetched");
  };

  const handleSearch = () => {
    const s = search.toLowerCase();
    const f = data.filter(
      (item) =>
        item.title.toLowerCase().includes(s) ||
        item.author.toLowerCase().includes(s) ||
        item.itemType.toLowerCase().includes(s) ||
        item.dept?.toLowerCase().includes(s)
    );
    setFiltered(f);
    showMessage("Filtered recommendations successfully","success");
  };
  const clearSearch = () => {
    setSearch("");
    setFiltered(data);
    showMessage("Cleared search box");
  };

  const openModal = (action) => {
    if (selected.length === 0) {
      alert("Please select atleast one book.");
      return;
    }
    setModalAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.put("http://localhost:8080/api/recommend/update-status", {
        ids: selected,
        status: modalAction === "approve" ? "Approved" : "Rejected",
      });

      alert("Status updated successfully"); 
      showMessage("Status updated successfully");

      const res=await axios.get("http://localhost:8080/api/recommend/pending");

      setData(res.data);
      setFiltered(res.data);
      setSelected([]);
    } catch (err) {
      console.log(err);
      showMessage(err,"error");
    }
    setModalOpen(false);
  };

  const displayData = showAll ? filtered : filtered.slice(0, 10);
  return (
    <div className="hodContainer">
      <h2>Online Book Recommendations</h2>
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
      />

      <ConfirmModal
        open={modalOpen}
        title={
          modalAction === "approve"
            ? "Are you sure you want to approve these suggestions ?"
            : "Are you sure you want to reject these suggestions ?"
        }
        books={filtered.filter((b) => selected.includes(b._id))}
        confirmText={
          modalAction === "approve"
            ? "Yes , approve suggestions"
            : "Yes , reject suggestions "
        }
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ApprovalPage;
