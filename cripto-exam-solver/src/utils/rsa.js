// src/utils/rsa.js

// Helper: greatest common divisor
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Helper: extended Euclidean algorithm (compact version, still exported)
export function extendedGcd(a, b) {
  let oldR = a, r = b;
  let oldS = 1, s = 0;
  let oldT = 0, t = 1;

  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }

  return { gcd: oldR, x: oldS, y: oldT }; // x*a + y*b = gcd
}

// Helper: modular inverse of e mod m (compact, still exported)
export function modInverse(e, m) {
  const { gcd: g, x } = extendedGcd(e, m);
  if (g !== 1) {
    throw new Error(`No inverse exists: gcd(${e}, ${m}) = ${g}`);
  }
  return ((x % m) + m) % m; // make it positive
}

// Helper: lcm
export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

// Very simple factorisation for small N (semiprime-style)
export function factorSemiprime(N) {
  for (let p = 2; p * p <= N; p++) {
    if (N % p === 0) {
      const q = N / p;
      return [p, q];
    }
  }
  // fallback: treat N as prime
  return [N];
}

// Modular exponentiation c^d mod N (using BigInt), compact version
export function modPow(base, exp, mod) {
  base = ((base % mod) + mod) % mod;
  let result = 1n;
  let b = BigInt(base);
  let e = BigInt(exp);
  const m = BigInt(mod);

  while (e > 0n) {
    if (e & 1n) {
      result = (result * b) % m;
    }
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(result);
}

// === NEW: verbose helpers ===

// Verbose fast exponentiation in Z_mod
function verboseModPow(base, exp, modN) {
  base = ((base % modN) + modN) % modN;
  let steps = "";

  steps += `   We compute ${base}^${exp} mod ${modN} by successive squaring.\n`;
  steps += `   Exponent ${exp} in binary is ${exp.toString(2)}.\n\n`;

  // Precompute base^(1), base^(2), base^(4), ...
  let powVals = [];
  let currentPow = 1;
  let currentVal = base;
  powVals.push({ pow: currentPow, val: currentVal });

  while (currentPow * 2 <= exp) {
    currentVal = (currentVal * currentVal) % modN;
    currentPow *= 2;
    powVals.push({ pow: currentPow, val: currentVal });
  }

  steps += `   Powers by squaring:\n`;
  powVals.forEach(({ pow, val }) => {
    steps += `      ${base}^${pow} ≡ ${val} (mod ${modN})\n`;
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

  // Multiply the selected powers modulo modN
  let acc = 1;
  steps += `   Now multiply the corresponding powers modulo ${modN}:\n`;
  chosen
    .sort((a, b) => a.pow - b.pow)
    .forEach(({ pow, val }) => {
      const before = acc;
      acc = (acc * val) % modN;
      steps += `      (${before} · ${base}^${pow}) ≡ ${before} · ${val} ≡ ${acc} (mod ${modN})\n`;
    });

  steps += `\n   Hence ${base}^${exp} ≡ ${acc} (mod ${modN}).\n\n`;

  return { result: acc, steps };
}

// Verbose modular inverse using extended Euclidean algorithm
function verboseModInverse(e, m) {
  let steps = "";
  let r0 = m;
  let r1 = e;
  let s0 = 1, s1 = 0; // r_i = s_i * m + t_i * e
  let t0 = 0, t1 = 1;

  steps += `   We apply the extended Euclidean algorithm to m = ${m} and e = ${e}.\n`;
  steps += `   We maintain r_i, s_i, t_i such that r_i = s_i·m + t_i·e.\n\n`;
  steps += `   Initial values:\n`;
  steps += `      r₀ = ${r0}, r₁ = ${r1}\n`;
  steps += `      s₀ = ${s0}, t₀ = ${t0}   (r₀ = ${s0}·${m} + ${t0}·${e})\n`;
  steps += `      s₁ = ${s1}, t₁ = ${t1}   (r₁ = ${s1}·${m} + ${t1}·${e})\n\n`;

  let k = 1;
  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    const r2 = r0 - q * r1;
    const s2 = s0 - q * s1;
    const t2 = t0 - q * t1;

    steps += `   Step ${k}:\n`;
    steps += `      q${k} = ⌊r₍${k-1}⌋ / r₍${k}⌋⌋ = ⌊${r0} / ${r1}⌋ = ${q}\n`;
    steps += `      r₂ = r₍${k-1}⌋ − q${k}·r₍${k}⌋ = ${r0} − ${q}·${r1} = ${r2}\n`;
    steps += `      s₂ = s₍${k-1}⌋ − q${k}·s₍${k}⌋ = ${s0} − ${q}·${s1} = ${s2}\n`;
    steps += `      t₂ = t₍${k-1}⌋ − q${k}·t₍${k}⌋ = ${t0} − ${q}·${t1} = ${t2}\n\n`;

    // shift
    r0 = r1; r1 = r2;
    s0 = s1; s1 = s2;
    t0 = t1; t1 = t2;
    k++;
  }

  const g = r0;
  steps += `   The last non-zero remainder is gcd(m, e) = ${g}.\n`;
  steps += `   At this point we have r = ${g} = s·m + t·e with s = ${s0}, t = ${t0}.\n`;

  if (g !== 1) {
    steps += `   Since gcd(m, e) ≠ 1, there is no modular inverse of e modulo m.\n`;
    throw new Error(`No inverse exists: gcd(${e}, ${m}) = ${g}`);
  }

  const inverse = ((t0 % m) + m) % m;
  steps += `   Since 1 = ${s0}·${m} + ${t0}·${e}, we have e⁻¹ ≡ ${t0} ≡ ${inverse} (mod ${m}).\n\n`;

  return { inverse, steps };
}

// Compute φ(N) assuming N is either prime or p*q
function computePhi(N, factors) {
  if (factors.length === 2) {
    const [p, q] = factors;
    return (p - 1) * (q - 1);
  }
  // N prime
  if (factors.length === 1) {
    return N - 1;
  }
  throw new Error("This template only supports N that are prime or product of two primes.");
}

// Compute λ(N) assuming N is either prime or p*q
function computeLambda(N, factors) {
  if (factors.length === 2) {
    const [p, q] = factors;
    return lcm(p - 1, q - 1);
  }
  // N prime
  if (factors.length === 1) {
    return N - 1;
  }
  throw new Error("This template only supports N that are prime or product of two primes.");
}

/**
 * Solve RSA decryption in the style of the exam.
 *
 * method = "phi"    -> use φ(N) (Exercise 4 style)
 * method = "lambda" -> use λ(N) (Exercise 5 style)
 */
export function solveRsaExample(N, e, c, method = "lambda") {
  const factors = factorSemiprime(N);
  let explanation = "";

  explanation += `We are given RSA modulo N = ${N} with public key e = ${e} and ciphertext c = ${c}.\n\n`;

  if (!(method === "phi" || method === "lambda")) {
    throw new Error(`Unknown method "${method}". Use "phi" or "lambda".`);
  }

  // 1) Factorisation
  if (factors.length === 2) {
    const [p, q] = factors;
    explanation += `1) Factorisation of N.\n`;
    explanation += `   The number ${N} has the prime factorisation ${N} = ${p} · ${q}.\n\n`;
  } else if (factors.length === 1) {
    const [p] = factors;
    explanation += `1) Factorisation of N.\n`;
    explanation += `   The modulus ${N} appears to be prime (N = ${p}).\n\n`;
  } else {
    throw new Error("N has more than two prime factors; this simple template doesn't handle that case.");
  }

  // 2) Compute modulus for the exponent: φ(N) or λ(N)
  let totient;
  if (method === "phi") {
    totient = computePhi(N, factors);
    explanation += `2) Compute ϕ(N).\n`;
    if (factors.length === 2) {
      const [p, q] = factors;
      explanation += `   ϕ(${N}) = (${p} − 1) · (${q} − 1) = ${p - 1} · ${q - 1} = ${totient}.\n\n`;
    } else {
      explanation += `   ϕ(${N}) = ${N} − 1 = ${totient}.\n\n`;
    }
  } else {
    totient = computeLambda(N, factors);
    explanation += `2) Compute λ(N).\n`;
    if (factors.length === 2) {
      const [p, q] = factors;
      const l = lcm(p - 1, q - 1);
      explanation += `   λ(${N}) = lcm(${p} − 1, ${q} − 1) = lcm(${p - 1}, ${q - 1}) = ${l}.\n\n`;
    } else {
      explanation += `   λ(${N}) = ${N} − 1 = ${totient}.\n\n`;
    }
  }

  // 3) Compute d = e^{-1} mod (ϕ(N) or λ(N)) with detailed Euclidean steps
  explanation += `3) Compute the private key d = e⁻¹ mod `;
  explanation += (method === "phi" ? `ϕ(N).\n` : `λ(N).\n`);
  explanation += `   We need d such that ${e} · d ≡ 1 (mod ${totient}).\n\n`;

  const { inverse: d, steps: invSteps } = verboseModInverse(e, totient);
  explanation += invSteps;

  // 4) Recover the clear message m with detailed fast exponentiation
  explanation += `4) Recover the clear message m.\n`;
  explanation += `   We compute m = cᵈ mod N = ${c}^${d} mod ${N}.\n\n`;

  const { result: m, steps: powSteps } = verboseModPow(c, d, N);
  explanation += powSteps;

  explanation += `So the clear message is m = ${m}.`;

  return { m, explanation };
}
