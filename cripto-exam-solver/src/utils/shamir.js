// src/utils/shamir.js
import { gcd } from "./rsa";

// Normalize into [0, p-1]
function mod(a, p) {
  return ((a % p) + p) % p;
}

/**
 * Verbose modular inverse using extended Euclidean algorithm.
 * Computes a^{-1} mod p and returns { inverse, steps }.
 */
function verboseModInverse(a, p) {
  let steps = "";
  let r0 = p;
  let r1 = mod(a, p);
  let s0 = 1, s1 = 0; // r_i = s_i·p + t_i·a
  let t0 = 0, t1 = 1;

  steps += `   We apply the extended Euclidean algorithm to p = ${p} and a = ${a}.\n`;
  steps += `   We maintain rᵢ, sᵢ, tᵢ such that rᵢ = sᵢ·p + tᵢ·a.\n\n`;
  steps += `   Initial values:\n`;
  steps += `      r₀ = ${r0}, r₁ = ${r1}\n`;
  steps += `      s₀ = ${s0}, t₀ = ${t0}   (r₀ = ${s0}·${p} + ${t0}·${a})\n`;
  steps += `      s₁ = ${s1}, t₁ = ${t1}   (r₁ = ${s1}·${p} + ${t1}·${a})\n\n`;

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

    r0 = r1; r1 = r2;
    s0 = s1; s1 = s2;
    t0 = t1; t1 = t2;
    k++;
  }

  const g = r0;
  steps += `   The last non-zero remainder is gcd(p, a) = ${g}.\n`;
  steps += `   At this point we have r = ${g} = s·p + t·a with s = ${s0}, t = ${t0}.\n`;

  if (g !== 1) {
    steps += `   Since gcd(p, a) ≠ 1, there is no modular inverse of a modulo p.\n`;
    throw new Error(`No inverse exists: gcd(${a}, ${p}) = ${g}`);
  }

  const inverse = mod(t0, p);
  steps += `   Since 1 = ${s0}·${p} + ${t0}·${a}, we have a⁻¹ ≡ ${t0} ≡ ${inverse} (mod ${p}).\n\n`;

  return { inverse, steps };
}

/**
 * Solve Shamir Secret Sharing for a degree-2 polynomial:
 * P(x) = s + a x + b x² over Z_p.
 *
 * Input:
 *   p: prime modulus
 *   pairs: array of three { alpha, value } objects
 *          representing (α, P(α))
 *
 * Output:
 *   { s, a, b, explanation }
 */
export function solveShamirDegree2(p, pairs) {
  if (!Array.isArray(pairs) || pairs.length !== 3) {
    throw new Error("Need exactly 3 share pairs for a degree-2 polynomial.");
  }

  // Extract and normalise
  let [p1, p2, p3] = pairs.map(({ alpha, value }) => ({
    alpha: mod(alpha, p),
    value: mod(value, p),
  }));

  const { alpha: x1, value: y1 } = p1;
  const { alpha: x2, value: y2 } = p2;
  const { alpha: x3, value: y3 } = p3;

  let explanation = "";

  explanation += `We work in the field ℤ_${p} and assume P(x) has degree 2:\n`;
  explanation += `   P(x) = s + a x + b x².\n\n`;
  explanation += `We are given the three shares (α, P(α)):\n`;
  explanation += `   (α₁, P(α₁)) = (${x1}, ${y1}), (α₂, P(α₂)) = (${x2}, ${y2}), (α₃, P(α₃)) = (${x3}, ${y3}).\n\n`;

  // Step 1: Write the system
  explanation += `1) Write the system of equations for P(x) = s + a x + b x²:\n`;
  explanation += `   For x = ${x1}:  s + a·${x1} + b·${x1}² = ${y1}\n`;
  explanation += `   For x = ${x2}:  s + a·${x2} + b·${x2}² = ${y2}\n`;
  explanation += `   For x = ${x3}:  s + a·${x3} + b·${x3}² = ${y3}\n\n`;

  // Step 2: subtract first equation from the others to eliminate s
  explanation += `2) Subtract the first equation from the other two to eliminate s.\n\n`;

  const A1 = mod(x2 - x1, p);
  const B1 = mod(x2 * x2 - x1 * x1, p);
  const C1 = mod(y2 - y1, p);

  const A2 = mod(x3 - x1, p);
  const B2 = mod(x3 * x3 - x1 * x1, p);
  const C2 = mod(y3 - y1, p);

  explanation += `   Equation for x = ${x2} minus equation for x = ${x1}:\n`;
  explanation += `      (a·${x2} + b·${x2}²) − (a·${x1} + b·${x1}²) = ${y2} − ${y1}\n`;
  explanation += `      ⇒ a·(${x2} − ${x1}) + b·(${x2}² − ${x1}²) = ${y2} − ${y1}\n`;
  explanation += `      ⇒ a·${A1} + b·${B1} = ${C1}  (in ℤ_${p}).\n\n`;

  explanation += `   Equation for x = ${x3} minus equation for x = ${x1}:\n`;
  explanation += `      (a·${x3} + b·${x3}²) − (a·${x1} + b·${x1}²) = ${y3} − ${y1}\n`;
  explanation += `      ⇒ a·(${x3} − ${x1}) + b·(${x3}² − ${x1}²) = ${y3} − ${y1}\n`;
  explanation += `      ⇒ a·${A2} + b·${B2} = ${C2}  (in ℤ_${p}).\n\n`;

  explanation += `   So we now have a 2×2 linear system in a and b over ℤ_${p}:\n`;
  explanation += `      a·${A1} + b·${B1} = ${C1}\n`;
  explanation += `      a·${A2} + b·${B2} = ${C2}\n\n`;

  // Step 3: Solve the 2x2 system for a and b
  explanation += `3) Solve this 2×2 system using the determinant.\n`;

  const D = mod(A1 * B2 - A2 * B1, p);
  explanation += `   Determinant D = A₁·B₂ − A₂·B₁ ≡ ${A1}·${B2} − ${A2}·${B1} ≡ ${D} (mod ${p}).\n`;

  if (gcd(D, p) !== 1) {
    throw new Error(`Determinant D = ${D} is not invertible modulo ${p}.`);
  }

  explanation += `   Since gcd(D, ${p}) = 1, D is invertible modulo ${p}.\n`;
  explanation += `   We now compute D⁻¹ mod ${p} using the extended Euclidean algorithm.\n\n`;

  const { inverse: Dinv, steps: invSteps } = verboseModInverse(D, p);
  explanation += invSteps;

  const a = mod((C1 * B2 - C2 * B1) * Dinv, p);
  const b = mod((A1 * C2 - A2 * C1) * Dinv, p);

  explanation += `   Using Cramer's rule (all computations in ℤ_${p}):\n`;
  explanation += `      a = (C₁·B₂ − C₂·B₁) · D⁻¹ ≡ (${C1}·${B2} − ${C2}·${B1}) · ${Dinv} ≡ ${a}.\n`;
  explanation += `      b = (A₁·C₂ − A₂·C₁) · D⁻¹ ≡ (${A1}·${C2} − ${A2}·${C1}) · ${Dinv} ≡ ${b}.\n\n`;

  // Step 4: recover s from the first equation
  explanation += `4) Recover s from the first original equation:\n`;
  explanation += `      s + a·${x1} + b·${x1}² = ${y1}.\n`;

  const s = mod(y1 - a * x1 - b * x1 * x1, p);
  explanation += `   So s ≡ ${y1} − ${a}·${x1} − ${b}·${x1}² (mod ${p}) = ${s}.\n\n`;

  explanation += `Therefore the shared secret is s = P(0) = ${s} in ℤ_${p}.`;

  return { s, a, b, explanation };
}
