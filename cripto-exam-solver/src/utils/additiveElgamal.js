// src/utils/additiveElgamal.js
import { modInverse, gcd } from "./rsa";

export function solveAdditiveElgamal(n, g, h, c1, c2) {
  let explanation = "";

  explanation += `We are given additive ElGamal modulo n = ${n} with generator g = ${g}.\n`;
  explanation += `The public key is h = ${h} and the encrypted message is (c1, c2) = (${c1}, ${c2}).\n\n`;

  explanation += `We work in the additive group (Z_${n}, +, 0). `;
  explanation += `The group operation is +, the notation ab means a·b in Z_${n}, `;
  explanation += `and a⁻¹ means −a (the additive inverse modulo ${n}).\n\n`;

  explanation += `In this special case we can recover the secret or temporary key by computing the multiplicative inverse of g modulo n.\n`;

  const gGcd = gcd(g, n);
  if (gGcd !== 1) {
    throw new Error(
      `g = ${g} is not invertible modulo ${n} because gcd(g, n) = ${gGcd} ≠ 1.`
    );
  }

  const gInv = modInverse(g, n);
  explanation += `We check gcd(g, n) = gcd(${g}, ${n}) = 1, so g has a multiplicative inverse.\n`;
  explanation += `Using the extended Euclidean algorithm we obtain g⁻¹ ≡ ${gInv} (mod ${n}).\n\n`;

  // First method: find secret key x
  const x = (gInv * h) % n;
  explanation += `First method: recover the secret key x.\n`;
  explanation += `  x = g⁻¹ · h ≡ (${gInv} · ${h}) mod ${n} = ${x}.\n`;
  let m1 = (c2 - x * c1) % n;
  if (m1 < 0) m1 += n;
  explanation += `  Then m = c2 − x·c1 ≡ ${c2} − ${x}·${c1} (mod ${n}) = ${m1}.\n\n`;

  // Second method: find temporary key y
  const y = (gInv * c1) % n;
  explanation += `Second method: recover the temporary key y.\n`;
  explanation += `  y = g⁻¹ · c1 ≡ (${gInv} · ${c1}) mod ${n} = ${y}.\n`;
  let m2 = (c2 - y * h) % n;
  if (m2 < 0) m2 += n;
  explanation += `  Then m = c2 − y·h ≡ ${c2} − ${y}·${h} (mod ${n}) = ${m2}.\n\n`;

  explanation += `Both methods should give the same clear message.\n`;
  explanation += `So the clear message is m = ${m1}.`;

  if (m1 !== m2) {
    explanation += `\n(Warning: the two methods gave different values: m₁ = ${m1}, m₂ = ${m2}.)`;
  }

  return { m: m1, explanation };
}
