import { useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL as string; // e.g. https://...amazonaws.com

type ApiResult = {
  ok?: boolean;
  data?: any;
  status?: number;
};

async function apiCall(path: string, method: string, body?: unknown): Promise<ApiResult> {
  const res = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try {
    return { ok: res.ok, data: JSON.parse(text), status: res.status };
  } catch {
    return { ok: res.ok, data: { raw: text }, status: res.status };
  }
}

export default function App() {
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const addTx = async () => {
    const amt = parseFloat(amount);
    if (Number.isNaN(amt)) {
      setStatus("Enter a valid amount");
      return;
    }
    setStatus("Adding...");
    const { ok, data, status } = await apiCall("/transaction", "POST", {
      amount: amt,
      type,
      category: category || "Other",
      note: note || "",
    });
    setStatus(ok ? "Added" : `Error ${status ?? ""}`);
    setOutput(JSON.stringify(data, null, 2));
  };

  const listTx = async () => {
    setStatus("Loading...");
    const { ok, data, status } = await apiCall("/transactions", "GET");
    setStatus(ok ? "OK" : `Error ${status ?? ""}`);
    setOutput(JSON.stringify(data, null, 2));
  };

  const summary = async () => {
    setStatus("Loading...");
    const { ok, data, status } = await apiCall("/summary", "GET");
    setStatus(ok ? "OK" : `Error ${status ?? ""}`);
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <main style={{ fontFamily: "system-ui, Arial", maxWidth: 720, margin: "40px auto" }}>
      <h1>CloudFinance (React)</h1>

      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr 1fr 2fr" }}>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <select value={type} onChange={(e) => setType(e.target.value as "expense" | "income")}>
          <option value="expense">expense</option>
          <option value="income">income</option>
        </select>
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
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
