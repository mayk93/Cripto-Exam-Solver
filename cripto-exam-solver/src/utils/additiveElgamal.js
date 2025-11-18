// src/utils/additiveElgamal.js
import { modInverse, gcd } from "./rsa";

// === Existing Exercise 2-style solver (given h, c1, c2) ===
export function solveAdditiveElgamal(n, g, h, c1, c2) {
  let explanation = "";

  explanation += `We are given additive ElGamal modulo n = ${n} with generator g = ${g}.\n`;
  explanation += `The public key is h = ${h} and the encrypted message is (c₁, c₂) = (${c1}, ${c2}).\n\n`;

  explanation += `We work in the additive group (ℤ_${n}, +, 0). Exponentiation means repeated addition,\n`;
  explanation += `so gʸ is implemented as y·g modulo n, and the inverse of + is subtraction.\n\n`;

  const gGcd = gcd(g, n);
  if (gGcd !== 1) {
    throw new Error(
      `g = ${g} is not invertible modulo ${n} because gcd(g, n) = ${gGcd} ≠ 1.`
    );
  }

  const gInv = modInverse(g, n);
  explanation += `We first compute the multiplicative inverse of g modulo n.\n`;
  explanation += `  gcd(g, n) = gcd(${g}, ${n}) = 1, so g has an inverse.\n`;
  explanation += `  Using the extended Euclidean algorithm we obtain g⁻¹ ≡ ${gInv} (mod ${n}).\n\n`;

  // Method 1: recover Alice’s secret key x and then m
  const x = (gInv * h) % n;
  let m1 = (c2 - x * c1) % n;
  if (m1 < 0) m1 += n;

  explanation += `Method 1 (using Alice's secret key):\n`;
  explanation += `  x = g⁻¹ · h ≡ (${gInv} · ${h}) mod ${n} = ${x}.\n`;
  explanation += `  Then the message is m = c₂ − x·c₁ ≡ ${c2} − ${x}·${c1} (mod ${n}) = ${m1}.\n\n`;

  // Method 2: recover temporary key y and then m
  const y = (gInv * c1) % n;
  let m2 = (c2 - y * h) % n;
  if (m2 < 0) m2 += n;

  explanation += `Method 2 (using Bob's temporary key):\n`;
  explanation += `  y = g⁻¹ · c₁ ≡ (${gInv} · ${c1}) mod ${n} = ${y}.\n`;
  explanation += `  Then the message is m = c₂ − y·h ≡ ${c2} − ${y}·${h} (mod ${n}) = ${m2}.\n\n`;

  explanation += `Both methods should give the same clear message.\n`;
  explanation += `So the clear message is m = ${m1}.`;

  if (m1 !== m2) {
    explanation += `\n(Warning: the two methods gave different values: m₁ = ${m1}, m₂ = ${m2}.)`;
  }

  return { m: m1, explanation };
}

// === NEW: Exercise 1-style solver (given x, y, m) ===
export function solveAdditiveElgamalKeys(n, g, x, y, m) {
  let explanation = "";

  explanation += `We are working in the additive ElGamal scheme modulo n = ${n} with generator g = ${g}.\n`;
  explanation += `Alice chooses the secret key x = ${x} and Bob chooses the temporary key y = ${y}.\n`;
  explanation += `The message to be encrypted is m = ${m}.\n\n`;

  explanation += `In the additive group (ℤ_${n}, +, 0), exponentiation gᵏ is understood as k·g modulo n.\n`;
  explanation += `We now compute the public key of Alice and the ciphertext produced by Bob.\n\n`;

  // Public key h = g^x (additive => x·g)
  let h = (g * x) % n;
  if (h < 0) h += n;

  explanation += `1) Public key of Alice.\n`;
  explanation += `   h = gˣ ≡ x·g mod n = ${x} · ${g} mod ${n} = ${h}.\n\n`;

  // Bob’s ciphertext:
  // c1 = g^y (additive => y·g)
  // c2 = m + h·y (additive masking)
  let c1 = (g * y) % n;
  if (c1 < 0) c1 += n;

  let c2 = (m + h * y) % n;
  if (c2 < 0) c2 += n;

  explanation += `2) Encryption by Bob.\n`;
  explanation += `   c₁ = gʸ ≡ y·g mod n = ${y} · ${g} mod ${n} = ${c1}.\n`;
  explanation += `   c₂ = m + h·y ≡ ${m} + ${h}·${y} (mod ${n}) = ${c2}.\n`;
  explanation += `   So Bob sends the ciphertext (c₁, c₂) = (${c1}, ${c2}).\n\n`;

  // Decryption by Alice: m = c2 - x*c1 (mod n)
  let mDec = (c2 - x * c1) % n;
  if (mDec < 0) mDec += n;

  explanation += `3) Decryption by Alice using her secret key x.\n`;
  explanation += `   m = c₂ − x·c₁ ≡ ${c2} − ${x}·${c1} (mod ${n}) = ${mDec}.\n\n`;

  // Eva’s attack: compute g^{-1}, then x = g^{-1} h
  const gGcd = gcd(g, n);
  if (gGcd !== 1) {
    throw new Error(
      `For Eva: g = ${g} is not invertible modulo ${n} because gcd(g, n) = ${gGcd} ≠ 1.`
    );
  }

  const gInv = modInverse(g, n);
  const xEva = (gInv * h) % n;
  const xEvaPos = xEva < 0 ? xEva + n : xEva;

  explanation += `4) Eva's attack using g⁻¹ mod n.\n`;
  explanation += `   First she computes the inverse of g modulo n.\n`;
  explanation += `   gcd(g, n) = gcd(${g}, ${n}) = 1, so g has an inverse.\n`;
  explanation += `   g⁻¹ ≡ ${gInv} (mod ${n}).\n`;
  explanation += `   Using the public key h, she recovers Alice's secret key as\n`;
  explanation += `   x = g⁻¹ · h ≡ ${gInv} · ${h} (mod ${n}) = ${xEvaPos}.\n\n`;

  explanation += `So the clear message is m = ${mDec}, and Eva can also recover Alice's secret key x = ${xEvaPos}.`;

  return { m: mDec, explanation };
}
