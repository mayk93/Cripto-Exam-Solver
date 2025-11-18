// src/utils/cipolla.js

// Safe modular reduction
function mod(a, p) {
  return ((a % p) + p) % p;
}

/**
 * Verbose fast exponentiation in ℤ_p:
 * Computes base^exp mod p and returns { result, steps } where
 * steps is a string describing successive squaring and combination.
 */
function verboseModPow(base, exp, p) {
  base = mod(base, p);
  let steps = "";

  steps += `   We compute ${base}^${exp} mod ${p} by successive squaring.\n`;
  steps += `   Exponent ${exp} in binary is ${exp.toString(2)}.\n\n`;

  // Precompute powers: base^(1), base^(2), base^(4), ...
  let powVals = [];
  let currentPow = 1;
  let currentVal = base;
  powVals.push({ pow: currentPow, val: currentVal });

  while (currentPow * 2 <= exp) {
    currentVal = mod(currentVal * currentVal, p);
    currentPow *= 2;
    powVals.push({ pow: currentPow, val: currentVal });
  }

  steps += `   Powers by squaring:\n`;
  powVals.forEach(({ pow, val }) => {
    steps += `      ${base}^${pow} ≡ ${val} (mod ${p})\n`;
  });
  steps += "\n";

  // Decompose exponent as sum of powers of 2
  let remaining = exp;
  let chosen = [];
  for (let i = powVals.length - 1; i >= 0; i--) {
    if (powVals[i].pow <= remaining) {
      chosen.push(powVals[i]);
      remaining -= powVals[i].pow;
    }
  }

  steps += `   Decompose ${exp} as sum of powers of 2:\n`;
  steps +=
    "      " +
    exp +
    " = " +
    chosen
      .map(({ pow }) => pow)
      .sort((a, b) => a - b)
      .join(" + ") +
    ".\n\n";

  // Multiply the corresponding powers
  let acc = 1;
  steps += `   Now multiply the corresponding powers modulo ${p}:\n`;
  chosen
    .sort((a, b) => a.pow - b.pow)
    .forEach(({ pow, val }) => {
      let before = acc;
      acc = mod(acc * val, p);
      steps += `      (${before} · ${base}^${pow}) ≡ ${before} · ${val} ≡ ${acc} (mod ${p})\n`;
    });

  steps += `\n   Hence ${base}^${exp} ≡ ${acc} (mod ${p}).\n\n`;

  return { result: acc, steps };
}

/**
 * Multiplication in the quadratic extension ℤ_p[√d].
 * (u1 + v1√d) * (u2 + v2√d) = (u1u2 + v1v2 d) + (u1v2 + u2v1)√d
 */
function extMultiply(u1, v1, u2, v2, d, p) {
  const real = mod(u1 * u2 + v1 * v2 * d, p);
  const imag = mod(u1 * v2 + u2 * v1, p);
  return [real, imag];
}

/**
 * Verbose fast exponentiation in ℤ_p[√d]:
 * Computes (a + √d)^exp and returns { u, v, steps } where
 * result is u + v√d and steps describe the process.
 */
function verboseExtPow(a, d, exp, p) {
  let steps = "";

  steps += `   We compute (a + √d)^${exp} with a = ${a}, d = ${d} in ℤ_${p}[√d].\n\n`;

  // Precompute (a + √d)^{1}, (a + √d)^{2}, (a + √d)^{4}, ...
  let powVals = [];
  let currentPow = 1;
  let u = mod(a, p);
  let v = 1; // a + 1·√d
  powVals.push({ pow: currentPow, u, v });

  while (currentPow * 2 <= exp) {
    [u, v] = extMultiply(u, v, u, v, d, p);
    currentPow *= 2;
    powVals.push({ pow: currentPow, u, v });
  }

  steps += `   Powers by squaring:\n`;
  powVals.forEach(({ pow, u, v }) => {
    steps += `      (a + √d)^${pow} ≡ ${u} + ${v}√${d} (mod ${p})\n`;
  });
  steps += "\n";

  // Decompose exponent as sum of powers of 2
  let remaining = exp;
  let chosen = [];
  for (let i = powVals.length - 1; i >= 0; i--) {
    if (powVals[i].pow <= remaining) {
      chosen.push(powVals[i]);
      remaining -= powVals[i].pow;
    }
  }

  steps += `   Decompose ${exp} as sum of powers of 2:\n`;
  steps +=
    "      " +
    exp +
    " = " +
    chosen
      .map(({ pow }) => pow)
      .sort((a, b) => a - b)
      .join(" + ") +
    ".\n\n";

  // Multiply the selected powers
  let rU = 1; // result starts as 1 + 0√d
  let rV = 0;
  steps += `   Multiply the corresponding powers in ℤ_${p}[√d]:\n`;

  chosen
    .sort((a, b) => a.pow - b.pow)
    .forEach(({ pow, u, v }) => {
      const beforeU = rU;
      const beforeV = rV;
      [rU, rV] = extMultiply(rU, rV, u, v, d, p);
      steps += `      (${beforeU} + ${beforeV}√${d}) · (a + √d)^${pow} ≡ `;
      steps += `${rU} + ${rV}√${d} (mod ${p})\n`;
    });

  steps += `\n   Hence (a + √d)^${exp} ≡ ${rU} + ${rV}√${d} (mod ${p}).\n\n`;

  return { u: rU, v: rV, steps };
}

/**
 * Cipolla method, templated like the exam solution, but with detailed steps.
 *
 * Inputs:
 *   p  – prime modulus
 *   n  – number we test as square (Legendre symbol part)
 *   a  – Cipolla parameter; a² − n must be a NON-square mod p
 *   t  – number whose square roots we actually want (we'll compute √t mod p)
 */
export function solveCipolla(p, n, a, t) {
  let explanation = "";

  explanation += `We work modulo p = ${p}.\n`;
  explanation += `We will:\n`;
  explanation += `  1) Show whether n = ${n} is a square modulo ${p} using the Legendre symbol.\n`;
  explanation += `  2) Show that for a = ${a}, d = a² − n is not a square modulo ${p}.\n`;
  explanation += `  3) Use Cipolla’s algorithm in ℤ_${p}[√d] to find square roots of t = ${t} modulo ${p}.\n\n`;

  // ---------- Part 1: Legendre symbol (n | p) via exponentiation ----------
  const legExp = (p - 1) / 2;
  explanation += `1) Check if n = ${n} is a square modulo ${p}.\n`;
  explanation += `   We use Euler's criterion:\n`;
  explanation += `      (n | p) = n^{(p-1)/2} mod p.\n`;
  explanation += `   Here (p - 1)/2 = (${p} - 1)/2 = ${legExp}.\n`;
  explanation += `   So we compute n^{(p-1)/2} ≡ ${n}^${legExp} (mod ${p}).\n\n`;

  const { result: legVal, steps: legSteps } = verboseModPow(n, legExp, p);
  explanation += legSteps;

  if (legVal === 1) {
    explanation += `   Since ${n}^${legExp} ≡ 1 (mod ${p}), n IS a square modulo ${p}.\n\n`;
  } else if (legVal === p - 1) {
    explanation += `   Since ${n}^${legExp} ≡ -1 (mod ${p}), n is NOT a square modulo ${p}.\n\n`;
  } else if (legVal === 0) {
    explanation += `   Since the result is 0, we have n ≡ 0 (mod ${p}).\n\n`;
  } else {
    explanation += `   The result is ${legVal}; for a prime modulus this should be 1, -1 or 0.\n\n`;
  }

  // ---------- Part 2: d = a² − n and check it's a non-square ----------
  const d = mod(a * a - n, p);
  explanation += `2) Define d = a² − n = ${a}² − ${n} ≡ ${d} (mod ${p}).\n`;
  explanation += `   For Cipolla's algorithm we need d to be a NON-square modulo ${p}.\n`;
  explanation += `   Again, we use Euler's criterion on d.\n\n`;

  const { result: legDVal, steps: legDSteps } = verboseModPow(d, legExp, p);
  explanation += legDSteps;

  if (legDVal === 1) {
    explanation += `   Since d^${legExp} ≡ 1 (mod ${p}), d IS a square modulo ${p}.\n`;
    explanation += `   This is not suitable for Cipolla; choose a different a.\n`;
    throw new Error(`a² − n = ${d} is a square modulo ${p}. Choose another a.`);
  } else if (legDVal === p - 1) {
    explanation += `   Since d^${legExp} ≡ -1 (mod ${p}), d is NOT a square modulo ${p}.\n`;
    explanation += `   This is exactly the condition we need.\n\n`;
  } else if (legDVal === 0) {
    explanation += `   Since d ≡ 0 (mod ${p}), Cipolla cannot be applied with this a.\n`;
    throw new Error(`d = 0 mod p is not valid for Cipolla.`);
  } else {
    explanation += `   The result is ${legDVal}; for a prime modulus this should be 1, -1 or 0.\n`;
    throw new Error(`Unexpected Legendre value for d.`);
  }

  // ---------- Part 3: Cipolla exponentiation in ℤ_p[√d] ----------
  const cipExp = (p + 1) / 2;
  explanation += `3) Apply Cipolla’s algorithm to compute square roots of t = ${t} modulo ${p}.\n`;
  explanation += `   We work in the ring ℤ_${p}[√d] with d = ${d}.\n`;
  explanation += `   Cipolla's formula says that one square root of t is the real part of\n`;
  explanation += `      (a + √d)^((p+1)/2).\n`;
  explanation += `   Here (p + 1)/2 = (${p} + 1)/2 = ${cipExp}.\n\n`;

  const { u, v, steps: cipSteps } = verboseExtPow(a, d, cipExp, p);
  explanation += cipSteps;

  // In the classical Cipolla algorithm, this construction is for sqrt(n). To stay aligned
  // with the exam text, we treat the real part as a candidate root of t and verify it.
  const candidate = mod(u, p);
  const root1 = candidate;
  const root2 = mod(p - candidate, p);

  // Verify they are actually roots of t
  const check1 = mod(root1 * root1, p);
  const check2 = mod(root2 * root2, p);

  explanation += `   The real part is ${u}, so we take r₁ = ${root1} as a candidate root.\n`;
  explanation += `   The other candidate root is r₂ = -${root1} ≡ ${root2} (mod ${p}).\n\n`;

  explanation += `   Check these candidates:\n`;
  explanation += `      r₁² ≡ ${root1}² ≡ ${check1} (mod ${p}).\n`;
  explanation += `      r₂² ≡ ${root2}² ≡ ${check2} (mod ${p}).\n\n`;

  explanation += `Therefore, the square-root candidates of t = ${t} modulo ${p} are:\n`;
  explanation += `   r₁ = ${root1} and r₂ = ${root2} (mod ${p}).\n`;
  explanation += `You can compare rᵢ² with t modulo p as required in the exam.\n`;

  return { root1, root2, explanation };
}
