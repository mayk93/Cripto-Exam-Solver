// src/utils/cipolla.js

// safe modular reduction
function mod(a, p) {
  return ((a % p) + p) % p;
}

// Legendre symbol using Euler’s criterion: (n | p) = n^{(p-1)/2} mod p
export function legendre(n, p) {
  if (mod(n, p) === 0) return 0;
  const val = modPow(n, (p - 1) / 2, p);
  if (val === 1) return 1;
  if (val === p - 1) return -1;
  return val; // shouldn't happen for prime p
}

// modular exponentiation, BigInt for safety
export function modPow(base, exp, p) {
  let result = 1n;
  let b = BigInt(mod(base, p));
  let e = BigInt(exp);
  const m = BigInt(p);

  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(result);
}

/**
 * Cipolla method, templated like the exam solution.
 * Inputs:
 *   p  – prime modulus
 *   n  – test if square mod p using Legendre symbol
 *   a  – Cipolla parameter, must satisfy a^2 - n is NON-square modulo p
 *   t  – the number we're taking sqrt of modulo p
 */
export function solveCipolla(p, n, a, t) {
  let explanation = "";

  explanation += `We work modulo p = ${p}. We will:\n`;
  explanation += `  1) Show whether ${n} is a square modulo ${p}.\n`;
  explanation += `  2) Show that for a = ${a}, d = a² − ${n} is NOT a square mod ${p}.\n`;
  explanation += `  3) Use Cipolla’s algorithm in ℤ_${p}[√d] to compute √${t}.\n\n`;

  // ----- Part 1: Legendre symbol (n | p) -----
  explanation += `1) Check if ${n} is a square modulo ${p} using Legendre symbol.\n`;

  const leg = legendre(n, p);
  explanation += `   Compute n^{(p-1)/2} ≡ ${n}^{(${p}-1)/2} mod ${p}.\n`;

  if (leg === 1) {
    explanation += `   Since this equals 1, ${n} IS a square modulo ${p}.\n\n`;
  } else if (leg === -1) {
    explanation += `   Since this equals -1, ${n} is NOT a square modulo ${p}.\n\n`;
  } else {
    explanation += `   Since it equals 0, n ≡ 0 mod p.\n\n`;
  }

  // ----- Part 2: test d = a^2 - n -----
  const d = mod(a * a - n, p);
  explanation += `2) Compute d = a² − n = ${a}² − ${n} ≡ ${d} (mod ${p}).\n`;

  const leg_d = legendre(d, p);

  explanation += `   Check if d is a square using the Legendre symbol (d | p).\n`;

  if (leg_d === 1) {
    explanation += `   (d | p) = 1, so d IS a square modulo ${p}.`;
    explanation += `   For Cipolla, we require d to be a NON-square. Choose a different 'a'.\n`;
    throw new Error(`a² − n = ${d} is a square modulo ${p}. Choose another a.`);
  } else if (leg_d === -1) {
    explanation += `   (d | p) = -1, so d is NOT a square. This is the required condition.\n\n`;
  } else {
    explanation += `   d ≡ 0 mod p; not suitable for Cipolla.\n`;
    throw new Error(`d = 0 mod p not valid for Cipolla.`);
  }

  // ----- Part 3: Compute (a + sqrt(d))^{(p+1)/2} in Z_p[sqrt(d)] -----
  explanation += `3) Apply Cipolla’s algorithm to compute √${t} modulo ${p}.\n`;
  explanation += `   Let ω = √d, with d = ${d}. Work in R = ℤ_${p}[ω].\n\n`;

  const exp = (p + 1) / 2;
  explanation += `   Compute (a + ω)^((p+1)/2) = (${a} + √${d})^${exp}.\n`;
  explanation += `   Use fast exponentiation in the extension field.\n\n`;

  // Complex-like multiplication in Z_p[√d]:
  const multiply = (u1, v1, u2, v2) => {
    // (u1 + v1*ω)(u2 + v2*ω) = (u1u2 + v1v2*d) + (u1v2 + u2v1)*ω
    const real = mod(u1 * u2 + v1 * v2 * d, p);
    const imag = mod(u1 * u2 ? u1 * v2 + u2 * v1 : 0, p);
    return [real, imag];
  };

  // exponentiation in Z_p[√d]
  const cipollaPow = (a, d, e) => {
    let rU = 1; // real part of result
    let rV = 0; // imag part of result
    let bU = a; // base real
    let bV = 1; // base imag (we compute (a + ω)^e)
    e = BigInt(e);

    while (e > 0n) {
      if (e & 1n) {
        [rU, rV] = multiply(rU, rV, bU, bV);
      }
      [bU, bV] = multiply(bU, bV, bU, bV);
      e >>= 1n;
    }
    return [rU, rV];
  };

  // Compute (a + ω)^{(p+1)/2}
  const [u, v] = cipollaPow(a, d, exp);

  explanation += `   After exponentiation, we obtain:\n`;
  explanation += `      (${a} + √${d})^${exp} ≡ ${u} + ${v}√${d}.\n\n`;

  // The real part u satisfies u^2 ≡ t (mod p)
  // If Cipolla is done correctly, u is one of the roots.
  const root1 = mod(u, p);
  const root2 = mod(p - u, p);

  explanation += `   The real part ${u} is one square root of ${t} modulo ${p}.\n`;
  explanation += `   The other root is −${u} ≡ ${root2} mod ${p}.\n\n`;
  explanation += `Therefore, the square roots of ${t} modulo ${p} are:\n`;
  explanation += `   √${t} ≡ ${root1} and ${root2} (mod ${p}).`;

  return { root1, root2, explanation };
}
