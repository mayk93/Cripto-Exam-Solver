// src/App.jsx
import { useState } from "react";
import { solveRsaExample } from "./utils/rsa";
import { solveAdditiveElgamal } from "./utils/additiveElgamal";

export default function App() {
  // --- Exercise 1: RSA (with φ / λ) ---
  const [rsaN, setRsaN] = useState("35");
  const [rsaE, setRsaE] = useState("5");
  const [rsaC, setRsaC] = useState("33");
  const [rsaMethod, setRsaMethod] = useState("lambda"); // "phi" or "lambda"
  const [rsaOutput, setRsaOutput] = useState("");

  function handleSolveRsa() {
    try {
      const { explanation } = solveRsaExample(
        parseInt(rsaN, 10),
        parseInt(rsaE, 10),
        parseInt(rsaC, 10),
        rsaMethod
      );
      setRsaOutput(explanation);
    } catch (err) {
      setRsaOutput("Error: " + err.message);
    }
  }

  // --- Exercise 2: Additive ElGamal ---
  const [elN, setElN] = useState("1000");
  const [elG, setElG] = useState("667");
  const [elH, setElH] = useState("21");
  const [elC1, setElC1] = useState("81");
  const [elC2, setElC2] = useState("27");
  const [elOutput, setElOutput] = useState("");

  function handleSolveElgamal() {
    try {
      const { explanation } = solveAdditiveElgamal(
        parseInt(elN, 10),
        parseInt(elG, 10),
        parseInt(elH, 10),
        parseInt(elC1, 10),
        parseInt(elC2, 10)
      );
      setElOutput(explanation);
    } catch (err) {
      setElOutput("Error: " + err.message);
    }
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1>Crypto Exercises Helper</h1>
      <p>
        All exercises are on a single page, mimicking the exam sheet. Each block lets you
        change the parameters and regenerates the solution template.
      </p>

      {/* Exercise 1: RSA */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Exercise 1 &mdash; RSA</h2>
        <p>
          RSA decryption with parameters (N, e, c). You can choose to solve it using ϕ(N) or
          λ(N), like in the exam.
        </p>

        <div style={{ display: "grid", gap: "0.75rem", maxWidth: "320px" }}>
          <label>
            N (modulus):
            <input
              type="number"
              value={rsaN}
              onChange={(e) => setRsaN(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            e (public exponent):
            <input
              type="number"
              value={rsaE}
              onChange={(e) => setRsaE(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            c (ciphertext):
            <input
              type="number"
              value={rsaC}
              onChange={(e) => setRsaC(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Method:
            <select
              value={rsaMethod}
              onChange={(e) => setRsaMethod(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="phi">Using ϕ(N)</option>
              <option value="lambda">Using λ(N)</option>
            </select>
          </label>

          <button onClick={handleSolveRsa} style={{ marginTop: "0.5rem" }}>
            Solve Exercise 1
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
          {rsaOutput}
        </pre>
      </section>

      <hr style={{ margin: "3rem 0" }} />

      {/* Exercise 2: Additive ElGamal */}
      <section>
        <h2>Exercise 2 &mdash; Additive ElGamal</h2>
        <p>
          Additive ElGamal modulo n with generator g, public key h and ciphertext
          (c₁, c₂). This follows the exact style of the worked solution in the sheet.
        </p>

        <div style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
          <label>
            n (modulus):
            <input
              type="number"
              value={elN}
              onChange={(e) => setElN(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            g (generator):
            <input
              type="number"
              value={elG}
              onChange={(e) => setElG(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            h (public key):
            <input
              type="number"
              value={elH}
              onChange={(e) => setElH(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            c₁:
            <input
              type="number"
              value={elC1}
              onChange={(e) => setElC1(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            c₂:
            <input
              type="number"
              value={elC2}
              onChange={(e) => setElC2(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <button onClick={handleSolveElgamal} style={{ marginTop: "0.5rem" }}>
            Solve Exercise 2
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
          {elOutput}
        </pre>
      </section>
    </div>
  );
}
