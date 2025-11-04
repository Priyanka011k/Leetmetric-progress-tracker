import React, { useState } from "react";
import "../App.css";

function ProgressChecker() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLeetCodeData = async () => {
    if (!username) {
      setError("Please enter a LeetCode username!");
      return;
    }

    setError("");
    setData(null);
    setLoading(true);

    try {
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      if (!res.ok) throw new Error("User not found");
      const result = await res.json();
      if (result.status === "error") throw new Error("Invalid username or user not found");
      setData(result);
    } catch (err) {
      setError("Could not fetch data. Check the username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="progress-container">
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter LeetCode username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={fetchLeetCodeData}>Check Progress</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <div className="stats-card">
          <h3>📘 {username}'s LeetCode Stats</h3>
          <p>Total Solved: <b>{data.totalSolved}</b> / {data.totalQuestions}</p>
          <div className="difficulty-row">
            <span className="pill easy">
              Easy: {data.easySolved} / {data.totalEasy}
            </span>
            <span className="pill medium">
              Medium: {data.mediumSolved} / {data.totalMedium}
            </span>
            <span className="pill hard">
              Hard: {data.hardSolved} / {data.totalHard}
            </span>
          </div>
          <p>Ranking: <b>{data.ranking || "N/A"}</b></p>
          <p>Acceptance Rate: {data.acceptanceRate}%</p>
        </div>
      )}
    </div>
  );
}

export default ProgressChecker;
