import React, { useEffect, useState } from "react";
import axios from "axios";
import NewRecommendBtn from "../components/homePage/newRecommend";
import RecommendTable from "../components/homePage/recommendTable";
import "./AllRecommend.css";
import SearchBar from "../components/homePage/SearchBar";
import { useMessage } from "../context/MessageContext";

const AllRecommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [search ,setSearch]=useState("");

  const {showMessage}=useMessage();
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/recommend")
      .then((res) => {
        console.log(res);
        showMessage("All recommendations fetched","success"); 
        setRecommendations(res.data);
        
    }
    )
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
      <h2 className="homeHeading">Your Recommendations</h2>
      <SearchBar setSearch={setSearch}/> 
      <NewRecommendBtn />
      <RecommendTable recommendations={filteredRecommendations} setRecommendations={setRecommendations} />
    </div>
  );
};

export default AllRecommend;
