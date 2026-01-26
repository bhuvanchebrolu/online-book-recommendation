import React from "react";
import "./ResultTable.css";

const ResultTable = ({ displayData,selected,setSelected }) => {
  const toggleSelect=(id)=>{
    if(selected.includes(id)){
        setSelected(selected.filter(x=>x!==id));
    }else{
        setSelected([...selected,id]);
    }
  }  
  return (
    <div>
      <table className="hodTable">
        <thead>
          <tr>
            <th></th>
            <th>Summary</th>
            <th>Suggested On</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {displayData.map((item) => (
            <tr key={item._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                />
              </td>
              <td>
                <div className="sumTitle">{item.title}</div>
                <div className="sumDetails">
                  {item.author}, {item.year} — {item.itemType || "N/A"}{" "}
                  (Quantity: {item.quantity}) (Price: {item.currency}{" "}
                  {item.price})
                  ISBN: {item.isbn}
                </div>
              </td>

              <td>
                {new Date(item.createdAt).toLocaleDateString("en-GB")}
              </td>

              <td className={`status ${item.status}`}>
                {item.status || "Requested"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
