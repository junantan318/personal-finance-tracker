import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL; // e.g. https://...amazonaws.com

async function apiCall(path, method, body) {
  const res = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, data: { raw: text }, status: res.status }; }
}

export default function App() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [output, setOutput] = useState("");

  const addTx = async () => {
    const amt = parseFloat(amount);
    if (Number.isNaN(amt)) { setStatus("enter a valid amount"); return; }
    setStatus("adding...");
    const { ok, data, status } = await apiCall("/transaction", "POST", {
      amount: amt, type, category: category || "Other", note: note || ""
    });
    setStatus(ok ? "added" : `error ${status || ""}`);
    setOutput(JSON.stringify(data, null, 2));
  };

  const listTx = async () => {
    setStatus("loading...");
    const { ok, data, status } = await apiCall("/transactions", "GET");
    setStatus(ok ? "ok" : `error ${status || ""}`);
    setOutput(JSON.stringify(data, null, 2));
  };

  const summary = async () => {
    setStatus("loading...");
    const { ok, data, status } = await apiCall("/summary", "GET");
    setStatus(ok ? "ok" : `error ${status || ""}`);
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <main style={{ fontFamily: "system-ui, Arial", maxWidth: 720, margin: "40px auto" }}>
      <h1>CloudFinance (React bare-bones)</h1>

      <div>
        <input type="number" step="0.01" value={amount}
               onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="expense">expense</option>
          <option value="income">income</option>
        </select>
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note" />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={addTx}>Add</button>{" "}
        <button onClick={listTx}>List</button>{" "}
        <button onClick={summary}>Summary</button>
      </div>

      <p>{status}</p>
      <pre style={{ background: "#f6f8fa", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>
        {output}
      </pre>
    </main>
  );
}
