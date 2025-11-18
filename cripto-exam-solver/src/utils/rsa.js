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

// Helper: extended Euclidean algorithm
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

// Helper: modular inverse of e mod m
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

// Modular exponentiation c^d mod N (using BigInt)
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

  // 3) Compute d = e^{-1} mod (ϕ(N) or λ(N))
  explanation += `3) Compute the private key d = e⁻¹ mod `;
  explanation += (method === "phi" ? `ϕ(N).\n` : `λ(N).\n`);
  const d = modInverse(e, totient);
  explanation += `   We need d such that ${e} · d ≡ 1 (mod ${totient}).\n`;
  explanation += `   Using the extended Euclidean algorithm we obtain d = ${d}.\n\n`;

  // 4) Recover the clear message m
  const m = modPow(c, d, N);
  explanation += `4) Recover the clear message m.\n`;
  explanation += `   m = cᵈ mod N = ${c}^${d} mod ${N} = ${m}.\n\n`;
  explanation += `So the clear message is m = ${m}.`;

  return { m, explanation };
}
