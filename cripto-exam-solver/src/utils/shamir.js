// src/utils/shamir.js
import { modInverse, gcd } from "./rsa";

// Normalize into [0, p-1]
function mod(a, p) {
  return ((a % p) + p) % p;
}

/**
 * Solve Shamir Secret Sharing for a degree-2 polynomial:
 * P(x) = s + a x + b x^2 over Z_p.
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
  explanation += `   (${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3}).\n\n`;

  // Step 1: Write the system
  explanation += `1) Write the system of equations for P(x) = s + a x + b x²:\n`;
  explanation += `   For x = ${x1}:  s + a·${x1} + b·${x1}² = ${y1}\n`;
  explanation += `   For x = ${x2}:  s + a·${x2} + b·${x2}² = ${y2}\n`;
  explanation += `   For x = ${x3}:  s + a·${x3} + b·${x3}² = ${y3}\n\n`;

  // Step 2: subtract first equation from the others to eliminate s
  explanation += `2) Subtract the first equation from the other two to eliminate s.\n`;

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
  explanation += `   Determinant D = ${A1}·${B2} − ${A2}·${B1} ≡ ${D} (mod ${p}).\n`;

  if (gcd(D, p) !== 1) {
    throw new Error(`Determinant D = ${D} is not invertible modulo ${p}.`);
  }

  const Dinv = modInverse(D, p);
  explanation += `   Since gcd(D, ${p}) = 1, D is invertible and D⁻¹ ≡ ${Dinv} (mod ${p}).\n\n`;

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
