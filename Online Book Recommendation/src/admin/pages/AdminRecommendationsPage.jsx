import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import AdminRecommendationTable from "../components/AdminRecommendationTable";
import ShowMoreButton from "../components/ShowMoreButton";
import api from "../../utils/axios";
import { useMessage } from "../../context/MessageContext";

import "./AdminRecommendationsPage.css";

const AdminRecommendationsPage = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { showMessage } = useMessage();

  useEffect(() => {
    api
      .get("/api/admin/processed")
      .then((res) => {
        setData(res.data);
        setFiltered(res.data);
        showMessage("Loaded all recommendations successfully", "success");
      })
      .catch((err) => {
        console.error(err);
        showMessage("Failed to load recommendations", "error");
      });
  }, []);

  const handleSearch = () => {
    const s = search.toLowerCase();
    const f = data.filter(
      (item) =>
        item.title.toLowerCase().includes(s) ||
        item.author.toLowerCase().includes(s) ||
        item.dept?.toLowerCase().includes(s) ||
        item.recommendedBy?.name?.toLowerCase().includes(s)
    );

    setFiltered(f);

    if (f.length === 0) {
      showMessage("No matching recommendations found", "error");
    } else {
      showMessage(`${f.length} recommendation(s) found`, "success");
    }
  };

  const clearSearch = () => {
    setSearch("");
    setFiltered(data);
    showMessage("Search cleared", "info");
  };

  const displayData = showAll ? filtered : filtered.slice(0, 10);

  return (
    <div className="adminContainer">
      <h2>Book Recommendations (Academic Records)</h2>
      <p>List of all approved books</p>

      <div className="adminSection">
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          data={filtered}
        />

        <AdminRecommendationTable data={displayData} />

        {!showAll && filtered.length > 10 && (
          <ShowMoreButton
            total={filtered.length}
            onClick={() => {
              setShowAll(true);
              showMessage("Showing all recommendations", "info");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminRecommendationsPage;
