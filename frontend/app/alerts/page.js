"use client";

import { useState } from "react";

export default function CreateForm() {
  const [email, setEmail] = useState("");
  const [aprice, setAPrice] = useState("");
  const [token, setToken] = useState("ethereum");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const price = Number(aprice);
    const newAlert = {
      email,
      token,
      price,
    };

    try {
      const res = await fetch("http://localhost:4000/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlert),
      });
      if (res.ok) {
        setError(null);
      } else {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setEmail("");
      setAPrice("");
    }
  };

  return (
    <main>
      <h1 className="text-center">Request Price Alerts</h1>
      <form onSubmit={handleSubmit} className="w-1/2">
        <label>
          <span>Email:</span>
          <input
            required
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>Token:</span>
          <select onChange={(e) => setToken(e.target.value)} value={token}>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
          </select>
        </label>
        <label>
          <span>Alert Price:</span>
          <input
            required
            onChange={(e) => setAPrice(e.target.value)}
            value={aprice}
          />
        </label>
        <button className="btn-primary" disabled={isLoading}>
          {isLoading && <span>Adding...</span>}
          {!isLoading && <span>Add Alert</span>}
        </button>
      </form>
      {error && (
        <div className="card">
          <h2 className="text-center my-5">{error}</h2>
        </div>
      )}
      {error === null && (
        <div className="card text-center">
          <span>"New Alert has been set"</span>
        </div>
      )}
    </main>
  );
}
