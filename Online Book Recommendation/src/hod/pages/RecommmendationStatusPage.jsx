import React, { useEffect, useState } from "react";
import ApprovedSearchBar from "../components/recommendationStatusPage/ApprovedSearchBar";
import ApprovedTable from "../components/recommendationStatusPage/ApprovedTable";
import ShowMoreButton from "../components/recommendationStatusPage/ShowMoreButton";
import PrintApprovedBooks from "../components/recommendationStatusPage/PrintApprovedBooks";
import { useMessage } from "../../context/MessageContext";
import { useAuth } from "../../context/AuthContext"; 
import nittLogo from "../../assets/nitt-logo.png";

import "./RecommendationStatusPage.css";
import api from "../../utils/axios";

const RecommmendationStatusPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { showMessage } = useMessage();

  useEffect(() => {
    api
      .get("/api/recommend/processed")
      .then((res) => {
        setData(res.data);
        setFiltered(res.data);
        showMessage("Processed Recommendations fetched", "success");
      })
      .catch((err) => {
        console.error(err);
        showMessage(
          err.response?.data?.message ||
            "Failed to fetch processed recommendations",
          "error",
        );
      });
  }, []);

  const handleSearch = () => {
    const s = search.toLowerCase();
    const f = data.filter(
      (b) =>
        b.title?.toLowerCase().includes(s) ||
        b.author?.toLowerCase().includes(s) ||
        b.itemType?.toLowerCase().includes(s) ||
        b.dept?.toLowerCase().includes(s) ||
        b.recommendedBy?.name?.toLowerCase().includes(s)
    );
    setFiltered(f);
    showMessage("Recommendations filtered");
  };

  const clearSearch = () => {
    setSearch("");
    setFiltered(data);
    showMessage("Cleared search box successfully", "success");
  };

  const displayed = showAll ? filtered : filtered.slice(0, 10);
  const approvedOnly = filtered.filter((b) => b.status === "Approved");

  return (
    <div className="approvedContainer">
      <div className="approvedHeaderRow">
        <h2>Online Book Recommendation Status</h2>
        <PrintApprovedBooks data={approvedOnly} user={user} logoUrl={nittLogo} />
      </div>

      <ApprovedSearchBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
      />
      <ApprovedTable data={displayed} />

      {!showAll && filtered.length > 10 && (
        <ShowMoreButton
          total={filtered.length}
          onClick={() => setShowAll(true)}
        />
      )}
    </div>
  );
};

export default RecommmendationStatusPage;