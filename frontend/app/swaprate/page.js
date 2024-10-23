"use client";

import { useState } from "react";

export default function CreateForm() {
  const [ethereum, setEthereum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notNumber, setNotNumber] = useState(false);
  const [state, setState] = useState({
    btc: null,
    fee: null,
    eth: null,
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isNaN(Number(ethereum))) {
      console.log("Enter an amount in numbers!!!");
      setNotNumber(true);
      setState(() => ({
        btc: null,
        fee: null,
        eth: null,
      }));
      setError(null);
    } else {
      const newTicket = {
        eth: Number(ethereum),
      };
      try {
        const res = await fetch("http://localhost:4000/swap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTicket),
        });
        const json = await res.json();
        if (res.ok) {
          setState(() => ({
            btc: json.btc,
            fee: json.fee,
            eth: json.eth,
          }));
          // console.log(json);
          setNotNumber(false);
          setError(null);
        } else {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setNotNumber(false);
        setState(() => ({
          btc: null,
          fee: null,
          eth: null,
        }));
      }
    }
    setIsLoading(false);
  };

  return (
    <main>
      <h1 className="text-center my-5">Get Swap Rates and Fee Calculated</h1>
      <form onSubmit={handleSubmit} className="w-1/2">
        <label>
          <span>Etner Ethereum amount :</span>
          <input
            required
            type="text"
            onChange={(e) => setEthereum(e.target.value)}
            value={ethereum}
          />
        </label>
        <button className="btn-primary" disabled={isLoading}>
          {isLoading && <span>Adding...</span>}
          {!isLoading && <span>Calculate</span>}
        </button>
      </form>
      {error && (
        <div className="card">
          <h2 className="text-center my-5">{error}</h2>
        </div>
      )}
      {notNumber && (
        <div className="card">
          <h2 className="text-center my-5">Enter an amount in numbers.</h2>
        </div>
      )}
      {error === null && state.btc != null && (
        <div className="card text-center">
          <span>{`You will get ${state.btc} Bitcoins for ${state.eth} Ethereum and our fee will be $${state.fee}....`}</span>
        </div>
      )}
    </main>
  );
}
