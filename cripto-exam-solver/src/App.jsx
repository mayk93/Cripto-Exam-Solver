// src/App.jsx
import { useState } from "react";
import { solveRsaExample } from "./utils/rsa";
import {
  solveAdditiveElgamal,
  solveAdditiveElgamalKeys,
} from "./utils/additiveElgamal";
import { solveMultiplicativeElgamal } from "./utils/multiplicativeElgamal";

export default function App() {
  // --- Exercise 1: RSA (ϕ / λ) ---
  const [rsaN, setRsaN] = useState("2021");
  const [rsaE, setRsaE] = useState("5");
  const [rsaC, setRsaC] = useState("6");
  const [rsaMethod, setRsaMethod] = useState("phi"); // "phi" or "lambda"
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

  // --- Exercise 2: Additive ElGamal (given h, c1, c2) ---
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

  // --- NEW: Exercise 2(b)/variant: Additive ElGamal (given x, y, m) ---
  const [akN, setAkN] = useState("2021");
  const [akG, setAkG] = useState("2020");
  const [akX, setAkX] = useState("2019");
  const [akY, setAkY] = useState("2018");
  const [akM, setAkM] = useState("2017");
  const [akOutput, setAkOutput] = useState("");

  function handleSolveAdditiveKeys() {
    try {
      const { explanation } = solveAdditiveElgamalKeys(
        parseInt(akN, 10),
        parseInt(akG, 10),
        parseInt(akX, 10),
        parseInt(akY, 10),
        parseInt(akM, 10)
      );
      setAkOutput(explanation);
    } catch (err) {
      setAkOutput("Error: " + err.message);
    }
  }

  // --- NEW: Exercise 3: Multiplicative ElGamal ---
  const [mgP, setMgP] = useState("43");
  const [mgG, setMgG] = useState("2");
  const [mgH, setMgH] = useState("11");
  const [mgC1, setMgC1] = useState("4");
  const [mgC2, setMgC2] = useState("5");
  const [mgOutput, setMgOutput] = useState("");

  function handleSolveMultiplicative() {
    try {
      const { explanation } = solveMultiplicativeElgamal(
        parseInt(mgP, 10),
        parseInt(mgG, 10),
        parseInt(mgH, 10),
        parseInt(mgC1, 10),
        parseInt(mgC2, 10)
      );
      setMgOutput(explanation);
    } catch (err) {
      setMgOutput("Error: " + err.message);
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
        <h2>Exercise 1 — RSA</h2>
        <p>
          RSA decryption modulo N with public key exponent e and ciphertext c. You can choose
          to solve it using ϕ(N) or λ(N).
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

      {/* Exercise 2: Additive ElGamal (h, c1, c2) */}
      <section>
        <h2>Exercise 2 — Additive ElGamal (ciphertext + public key)</h2>
        <p>
          Additive ElGamal modulo n with generator g, public key h and ciphertext (c₁, c₂).
          This matches the “Agent Eva” style exercise where we can recover m from (c₁, c₂, h).
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
            Solve Exercise 2 (ciphertext/public key)
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

      <hr style={{ margin: "3rem 0" }} />

      {/* Exercise 2(b): Additive ElGamal (x, y, m) */}
      <section>
        <h2>Exercise 2(b) — Additive ElGamal (keys and message)</h2>
        <p>
          Additive ElGamal modulo n with generator g, Alice's secret key x, Bob's temporary
          key y and plaintext message m. This templates the example with n = 2021, g = 2020,
          x = 2019, y = 2018, m = 2017.
        </p>

        <div style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
          <label>
            n (modulus):
            <input
              type="number"
              value={akN}
              onChange={(e) => setAkN(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            g (generator):
            <input
              type="number"
              value={akG}
              onChange={(e) => setAkG(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            x (Alice's secret key):
            <input
              type="number"
              value={akX}
              onChange={(e) => setAkX(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            y (Bob's temporary key):
            <input
              type="number"
              value={akY}
              onChange={(e) => setAkY(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            m (message):
            <input
              type="number"
              value={akM}
              onChange={(e) => setAkM(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <button onClick={handleSolveAdditiveKeys} style={{ marginTop: "0.5rem" }}>
            Solve Exercise 2(b) (keys/message)
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
          {akOutput}
        </pre>
      </section>

      <hr style={{ margin: "3rem 0" }} />

      {/* Exercise 3: Multiplicative ElGamal */}
      <section>
        <h2>Exercise 3 — Multiplicative ElGamal</h2>
        <p>
          Multiplicative ElGamal modulo a prime p, in the group generated by g. Given the
          public key h and ciphertext (c₁, c₂), we reconstruct the secret key x by discrete
          log (brute-force for small p) and then decrypt the message.
        </p>

        <div style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
          <label>
            p (prime modulus):
            <input
              type="number"
              value={mgP}
              onChange={(e) => setMgP(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            g (generator):
            <input
              type="number"
              value={mgG}
              onChange={(e) => setMgG(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            h (public key):
            <input
              type="number"
              value={mgH}
              onChange={(e) => setMgH(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            c₁:
            <input
              type="number"
              value={mgC1}
              onChange={(e) => setMgC1(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            c₂:
            <input
              type="number"
              value={mgC2}
              onChange={(e) => setMgC2(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <button onClick={handleSolveMultiplicative} style={{ marginTop: "0.5rem" }}>
            Solve Exercise 3 (multiplicative ElGamal)
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
          {mgOutput}
        </pre>
      </section>
    </div>
  );
}
