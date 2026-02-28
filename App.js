import React, { useState } from "react";
import "./App.css";

function App() {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const handleLookup = async () => {
    setError("");
    setData([]);
    setFilteredData([]);
    setShowFilter(false);

    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Pincode must be exactly 6 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const result = await response.json();

      if (result[0].Status === "Error") {
        setError("No data found for this pincode");
        setLoading(false);
        return;
      }

      setData(result[0].PostOffice);
      setFilteredData(result[0].PostOffice);
      setShowFilter(true);
    } catch (err) {
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = data.filter((post) =>
      post.Name.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <h1>Pincode Lookup</h1>

      <div className="lookup-section">
        <input
          type="text"
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button onClick={handleLookup}>Lookup</button>
      </div>

      {loading && <div className="loader"></div>}

      {error && <p className="error">{error}</p>}

      {showFilter && (
        <input
          type="text"
          placeholder="Filter by Post Office Name"
          onChange={handleFilter}
          className="filter-input"
        />
      )}

      <div className="results">
        {filteredData.length > 0 ? (
          filteredData.map((post, index) => (
            <div className="card" key={index}>
              <p><strong>Name:</strong> {post.Name}</p>
              <p><strong>Pincode:</strong> {post.Pincode}</p>
              <p><strong>District:</strong> {post.District}</p>
              <p><strong>State:</strong> {post.State}</p>
            </div>
          ))
        ) : (
          showFilter &&
          !loading && (
            <p>Couldn’t find the postal data you’re looking for…</p>
          )
        )}
      </div>
    </div>
  );
}

export default App;
