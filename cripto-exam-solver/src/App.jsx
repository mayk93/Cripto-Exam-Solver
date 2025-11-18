// src/App.jsx
import { useState } from "react";
import { solveRsaExample } from "./utils/rsa";

export default function App() {
  // You can pick defaults you like: here I use the 2021 example
  const [N, setN] = useState("2021");
  const [e, setE] = useState("5");
  const [c, setC] = useState("6");
  const [method, setMethod] = useState("phi"); // "phi" or "lambda"
  const [output, setOutput] = useState("");

  function handleSolve() {
    try {
      const { explanation } = solveRsaExample(
        parseInt(N, 10),
        parseInt(e, 10),
        parseInt(c, 10),
        method
      );
      setOutput(explanation);
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", fontFamily: "system-ui, sans-serif" }}>
      <h1>RSA Exercise Solver</h1>

      <p>
        This templates the exam-style RSA exercises. Choose the modulus, public key, ciphertext,
        and whether to use ϕ(N) or λ(N), like in Exercises 4 and 5.
      </p>

      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "320px" }}>
        <label>
          N (modulus):
          <input
            type="number"
            value={N}
            onChange={(e) => setN(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          e (public exponent):
          <input
            type="number"
            value={e}
            onChange={(e) => setE(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          c (ciphertext):
          <input
            type="number"
            value={c}
            onChange={(e) => setC(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Method:
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="phi">Using ϕ(N)</option>
            <option value="lambda">Using λ(N)</option>
          </select>
        </label>

        <button onClick={handleSolve} style={{ marginTop: "0.5rem" }}>
          Solve
        </button>
      </div>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          color: "#333",
          background: "#f0f0f0",
          marginTop: "1.5rem",
          padding: "1rem",
          borderRadius: "8px",
          fontFamily: "monospace",
        }}
      >
        {output}
      </pre>
    </div>
  );
}
