// src/App.jsx
import { useState } from "react";
import { solveRsaExample } from "./utils/rsa";
import {
  solveAdditiveElgamal,
  solveAdditiveElgamalKeys,
} from "./utils/additiveElgamal";
import { solveMultiplicativeElgamal, solveMultiplicativeElgamalTwoMethods } from "./utils/multiplicativeElgamal";
import { solveShamirDegree2 } from "./utils/shamir";
import { solveCipolla } from "./utils/cipolla";

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

// --- NEW: Exercise 3(b): Multiplicative ElGamal (two methods) ---
const [mg2P, setMg2P] = useState("29");
const [mg2G, setMg2G] = useState("2");
const [mg2H, setMg2H] = useState("24");
const [mg2C1, setMg2C1] = useState("7");
const [mg2C2, setMg2C2] = useState("21");
const [mg2Output, setMg2Output] = useState("");

function handleSolveMultiplicativeTwo() {
  try {
    const { explanation } = solveMultiplicativeElgamalTwoMethods(
      parseInt(mg2P, 10),
      parseInt(mg2G, 10),
      parseInt(mg2H, 10),
      parseInt(mg2C1, 10),
      parseInt(mg2C2, 10)
    );
    setMg2Output(explanation);
  } catch (err) {
    setMg2Output("Error: " + err.message);
  }
}

// --- Shamir Secret Sharing (degree 2) ---
const [shP, setShP] = useState("29");

const [shA1, setShA1] = useState("1");
const [shY1, setShY1] = useState("15");

const [shA2, setShA2] = useState("2");
const [shY2, setShY2] = useState("6");

const [shA3, setShA3] = useState("3");
const [shY3, setShY3] = useState("7");

const [shOutput, setShOutput] = useState("");

function handleSolveShamir() {
  try {
    const { explanation } = solveShamirDegree2(
      parseInt(shP, 10),
      [
        { alpha: parseInt(shA1, 10), value: parseInt(shY1, 10) },
        { alpha: parseInt(shA2, 10), value: parseInt(shY2, 10) },
        { alpha: parseInt(shA3, 10), value: parseInt(shY3, 10) },
      ]
    );
    setShOutput(explanation);
  } catch (err) {
    setShOutput("Error: " + err.message);
  }
}

// --- Cipolla ---
const [ciP, setCiP] = useState("23");          // prime modulus
const [ciN, setCiN] = useState("3");           // number to test as square
const [ciA, setCiA] = useState("1");           // Cipolla parameter a
const [ciT, setCiT] = useState("7");           // number to extract sqrt of
const [ciOutput, setCiOutput] = useState("");

function handleSolveCipolla() {
  try {
    const { explanation } = solveCipolla(
      parseInt(ciP, 10),
      parseInt(ciN, 10),
      parseInt(ciA, 10),
      parseInt(ciT, 10)
    );
    setCiOutput(explanation);
  } catch (err) {
    setCiOutput("Error: " + err.message);
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

      <hr style={{ margin: "3rem 0" }} />

      <section>
        <h2>Exercise 3(b) — Multiplicative ElGamal (two methods)</h2>
        <p>
          Same parameters (p, g, h, c₁, c₂) as Exercise 3, but the solution is written in the
          style of the 23–24 model: first recover x and y from the table gⁿ mod p, then
          decrypt using both methods and compare the results.
        </p>

        <div style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
          <label>
            p (prime modulus):
            <input
              type="number"
              value={mg2P}
              onChange={(e) => setMg2P(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            g (generator):
            <input
              type="number"
              value={mg2G}
              onChange={(e) => setMg2G(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            h (public key):
            <input
              type="number"
              value={mg2H}
              onChange={(e) => setMg2H(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            c₁:
            <input
              type="number"
              value={mg2C1}
              onChange={(e) => setMg2C1(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            c₂:
            <input
              type="number"
              value={mg2C2}
              onChange={(e) => setMg2C2(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <button onClick={handleSolveMultiplicativeTwo} style={{ marginTop: "0.5rem" }}>
            Solve Exercise 3(b) (two methods)
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
          {mg2Output}
        </pre>
      </section>

      <hr style={{ margin: "3rem 0" }} />

      <section>
        <h2>Exercise 4 — Shamir Secret Sharing (degree 2)</h2>
        <p>
          Shamir Secret Sharing over ℤₚ with a quadratic polynomial P(x) = s + a x + b x².
          Enter p and three pairs (α, P(α)); the app reconstructs s = P(0) in the style of
          the solution in the model.
        </p>

        <div style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
          <label>
            p (prime modulus):
            <input
              type="number"
              value={shP}
              onChange={(e) => setShP(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            (α₁, P(α₁)):
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="number"
                value={shA1}
                onChange={(e) => setShA1(e.target.value)}
                style={{ width: "100%" }}
              />
              <input
                type="number"
                value={shY1}
                onChange={(e) => setShY1(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </label>

          <label>
            (α₂, P(α₂)):
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="number"
                value={shA2}
                onChange={(e) => setShA2(e.target.value)}
                style={{ width: "100%" }}
              />
              <input
                type="number"
                value={shY2}
                onChange={(e) => setShY2(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </label>

          <label>
            (α₃, P(α₃)):
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="number"
                value={shA3}
                onChange={(e) => setShA3(e.target.value)}
                style={{ width: "100%" }}
              />
              <input
                type="number"
                value={shY3}
                onChange={(e) => setShY3(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </label>

          <button onClick={handleSolveShamir} style={{ marginTop: "0.5rem" }}>
            Solve Exercise 4 (Shamir)
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
          {shOutput}
        </pre>
      </section>

      <hr style={{ margin: "3rem 0" }} />

      <section>
        <h2>Exercise 5 — Cipolla’s Algorithm</h2>
        <p>
          We check whether n is a square mod p, verify that d = a² − n is a non-square,
          then compute square roots of t via Cipolla’s algorithm in ℤₚ[√d].
        </p>

        <div style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
          <label>
            p (prime modulus, e.g. 23):
            <input
              type="number"
              value={ciP}
              onChange={(e) => setCiP(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            n (test if square, e.g. 3):
            <input
              type="number"
              value={ciN}
              onChange={(e) => setCiN(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            a (Cipolla parameter, must satisfy a² − n non-square, e.g. 1):
            <input
              type="number"
              value={ciA}
              onChange={(e) => setCiA(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            t (value to extract sqrt of, e.g. 7):
            <input
              type="number"
              value={ciT}
              onChange={(e) => setCiT(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <button onClick={handleSolveCipolla} style={{ marginTop: "0.5rem" }}>
            Solve Exercise 5 (Cipolla)
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
          {ciOutput}
        </pre>
      </section>

    </div>
  );
}
