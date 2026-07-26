import React, { useEffect, useState } from "react";
import NewRecommendBtn from "../components/homePage/newRecommend";
import RecommendTable from "../components/homePage/recommendTable";
import SearchBar from "../components/homePage/SearchBar";
import "./AllRecommend.css";
import { useMessage } from "../context/MessageContext";
import api from "../utils/axios";

const AllRecommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [search, setSearch] = useState("");
  const { showMessage } = useMessage();

  useEffect(() => {
    api
      .get("/api/recommend")
      .then((res) => {
        showMessage("All recommendations fetched", "success");
        setRecommendations(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredRecommendations =
    search.trim() === ""
      ? recommendations
      : recommendations.filter((b) => {
          const text = `${b.title} ${b.author} ${b.dept} ${b.itemType}`.toLowerCase();
          return text.includes(search.toLowerCase());
        });

  return (
    <div className="homeContainer">
      <div className="homeHeader">
        <div>
          <div className="homeHeader__badge">Faculty Portal</div>
          <h2 className="homeHeading">Your Recommendations</h2>
          <p className="homeSubtitle">
            {recommendations.length > 0
              ? `${recommendations.length} recommendation${recommendations.length !== 1 ? "s" : ""} submitted`
              : "No recommendations yet"}
          </p>
        </div>
        <NewRecommendBtn />
      </div>

      <div className="homeControls">
        <SearchBar setSearch={setSearch} />
      </div>

      <RecommendTable
        recommendations={filteredRecommendations}
        setRecommendations={setRecommendations}
      />
    </div>
  );
};

export default AllRecommend;