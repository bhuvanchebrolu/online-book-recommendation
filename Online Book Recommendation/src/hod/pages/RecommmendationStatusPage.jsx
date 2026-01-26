import React, { useEffect, useState } from "react";
import ApprovedSearchBar from "../components/recommendationStatusPage/ApprovedSearchBar";
import axios from "axios";
import ApprovedTable from "../components/recommendationStatusPage/ApprovedTable";
import ShowMoreButton from "../components/recommendationStatusPage/ShowMoreButton";
import { useMessage } from "../../context/MessageContext";

import "./RecommendationStatusPage.css";

const RecommmendationStatusPage = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const {showMessage}=useMessage();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/recommend/processed")
      .then((res) => {
        setData(res.data);
        setFiltered(res.data);
        showMessage("Processed Recommendations fetched","success");
      })
      .catch((err) => {
        console.log(err);
        showMessage(err,"error");
      });
  }, []);

  const handleSearch = () => {
    const s = search.toLowerCase();

    const f = data.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.author.toLowerCase().includes(s) ||
        b.itemType.toLowerCase().includes(s) ||
        b.dept?.toLowerCase().includes(s)
    );

    setFiltered(f);
    showMessage("Recommendations filtered");
  };

  const clearSearch=()=>{
    setSearch("");
    setFiltered(data);
    showMessage("Cleared search box successfully","success");
  }
  const displayed = showAll ? filtered : filtered.slice(0, 10);
  return (
    <div className="approvedContainer">
      <h2>Online Book Recommendation Status</h2>
      <ApprovedSearchBar search={search} setSearch={setSearch} handleSearch={handleSearch} clearSearch={clearSearch} />
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
