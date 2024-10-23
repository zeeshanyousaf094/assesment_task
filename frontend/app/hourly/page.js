"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/hours");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      const currentMinutes = new Date().getMinutes();
      if (currentMinutes === 0) {
        fetchData();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-center">Loading...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <h1 className="text-center"></h1>Error: {error}
      </div>
    );
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return (
    <main>
      <h1 className="text-center">Hourly Price Record</h1>
      {data &&
        data.map((d) => (
          <div className="card" key={d.id}>
            <h3>Time : {formatTimestamp(d.created_at)}</h3>
            <p>Ethereum : ${d.ethereum}</p>
            <p>Polygon : ${d.polygon}</p>
          </div>
        ))}
    </main>
  );
}
