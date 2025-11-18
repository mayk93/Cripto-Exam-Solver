// src/utils/additiveElgamal.js
import { gcd } from "./rsa";

// Safe modular reduction
function mod(a, n) {
  return ((a % n) + n) % n;
}

// Verbose modular inverse using extended Euclidean algorithm
function verboseModInverse(a, n) {
  let steps = "";
  let r0 = n;
  let r1 = a;
  let s0 = 1, s1 = 0; // r_i = s_i·n + t_i·a
  let t0 = 0, t1 = 1;

  steps += `   We apply the extended Euclidean algorithm to n = ${n} and a = ${a}.\n`;
  steps += `   We maintain rᵢ, sᵢ, tᵢ such that rᵢ = sᵢ·n + tᵢ·a.\n\n`;
  steps += `   Initial values:\n`;
  steps += `      r₀ = ${r0}, r₁ = ${r1}\n`;
  steps += `      s₀ = ${s0}, t₀ = ${t0}   (r₀ = ${s0}·${n} + ${t0}·${a})\n`;
  steps += `      s₁ = ${s1}, t₁ = ${t1}   (r₁ = ${s1}·${n} + ${t1}·${a})\n\n`;

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
  steps += `   The last non-zero remainder is gcd(n, a) = ${g}.\n`;
  steps += `   At this point we have r = ${g} = s·n + t·a with s = ${s0}, t = ${t0}.\n`;

  if (g !== 1) {
    steps += `   Since gcd(n, a) ≠ 1, there is no modular inverse of a modulo n.\n`;
    throw new Error(`No inverse exists: gcd(${a}, ${n}) = ${g}`);
  }

  const inverse = mod(t0, n);
  steps += `   Since 1 = ${s0}·${n} + ${t0}·${a}, we have a⁻¹ ≡ ${t0} ≡ ${inverse} (mod ${n}).\n\n`;

  return { inverse, steps };
}

// === Existing Exercise 2-style solver (given h, c1, c2) ===
export function solveAdditiveElgamal(n, g, h, c1, c2) {
  let explanation = "";

  explanation += `We are given additive ElGamal modulo n = ${n} with generator g = ${g}.\n`;
  explanation += `The public key is h = ${h} and the encrypted message is (c₁, c₂) = (${c1}, ${c2}).\n\n`;

  explanation += `We work in the additive group (ℤ_${n}, +, 0). Exponentiation gˣ is implemented as x·g mod n,\n`;
  explanation += `and the inverse of + is subtraction modulo ${n}.\n\n`;

  const gGcd = gcd(g, n);
  explanation += `1) Check that g has a multiplicative inverse modulo n.\n`;
  explanation += `   gcd(g, n) = gcd(${g}, ${n}) = ${gGcd}.\n`;
  if (gGcd !== 1) {
    explanation += `   Since this is not 1, g is not invertible modulo n. The scheme parameters are invalid.\n`;
    throw new Error(
      `g = ${g} is not invertible modulo ${n} because gcd(g, n) = ${gGcd} ≠ 1.`
    );
  }
  explanation += `   Since gcd(g, n) = 1, g is invertible modulo n.\n\n`;

  explanation += `2) Compute the inverse g⁻¹ using the extended Euclidean algorithm.\n`;
  const { inverse: gInv, steps: invSteps } = verboseModInverse(g, n);
  explanation += invSteps;

  // Method 1: recover Alice’s secret key x and then m
  explanation += `3) Method 1: recover Alice's secret key x and then the message m.\n`;
  const x = mod(gInv * h, n);
  explanation += `   x = g⁻¹ · h ≡ ${gInv} · ${h} (mod ${n}) = ${x}.\n`;
  let m1 = mod(c2 - x * c1, n);
  explanation += `   Then m = c₂ − x·c₁ ≡ ${c2} − ${x}·${c1} (mod ${n}) = ${m1}.\n\n`;

  // Method 2: recover temporary key y and then m
  explanation += `4) Method 2: recover Bob's temporary key y and then the message m.\n`;
  const y = mod(gInv * c1, n);
  explanation += `   y = g⁻¹ · c₁ ≡ ${gInv} · ${c1} (mod ${n}) = ${y}.\n`;
  let m2 = mod(c2 - y * h, n);
  explanation += `   Then m = c₂ − y·h ≡ ${c2} − ${y}·${h} (mod ${n}) = ${m2}.\n\n`;

  explanation += `5) Comparison of the two methods.\n`;
  explanation += `   Both methods should give the same clear message.\n`;
  explanation += `   Method 1 gives m = ${m1}.\n`;
  explanation += `   Method 2 gives m = ${m2}.\n`;

  if (m1 !== m2) {
    explanation += `   (Warning: the two methods gave different values; check the input parameters.)\n`;
  }

  explanation += `\nSo the clear message is m = ${m1}.`;

  return { m: m1, explanation };
}

// === Exercise 1-style solver (given x, y, m) ===
export function solveAdditiveElgamalKeys(n, g, x, y, m) {
  let explanation = "";

  explanation += `We are working in the additive ElGamal scheme modulo n = ${n} with generator g = ${g}.\n`;
  explanation += `Alice chooses the secret key x = ${x} and Bob chooses the temporary key y = ${y}.\n`;
  explanation += `The message to be encrypted is m = ${m}.\n\n`;

  explanation += `In the additive group (ℤ_${n}, +, 0), exponentiation gᵏ is understood as k·g modulo n.\n`;
  explanation += `We now compute the public key of Alice, the ciphertext, and show how an attacker can recover x.\n\n`;

  // Public key h = g^x (additive => x·g)
  let h = mod(g * x, n);

  explanation += `1) Public key of Alice.\n`;
  explanation += `   h = gˣ ≡ x·g mod n = ${x} · ${g} mod ${n} = ${h}.\n\n`;

  // Bob’s ciphertext:
  // c1 = g^y (additive => y·g)
  // c2 = m + h·y (additive masking)
  let c1 = mod(g * y, n);
  let c2 = mod(m + h * y, n);

  explanation += `2) Encryption by Bob.\n`;
  explanation += `   c₁ = gʸ ≡ y·g mod n = ${y} · ${g} mod ${n} = ${c1}.\n`;
  explanation += `   c₂ = m + h·y ≡ ${m} + ${h}·${y} (mod ${n}) = ${c2}.\n`;
  explanation += `   So Bob sends the ciphertext (c₁, c₂) = (${c1}, ${c2}).\n\n`;

  // Decryption by Alice: m = c2 - x*c1 (mod n)
  let mDec = mod(c2 - x * c1, n);

  explanation += `3) Decryption by Alice using her secret key x.\n`;
  explanation += `   m = c₂ − x·c₁ ≡ ${c2} − ${x}·${c1} (mod ${n}) = ${mDec}.\n\n`;

  // Eva’s attack: compute g^{-1}, then x = g^{-1} h
  const gGcd = gcd(g, n);
  explanation += `4) Eva's attack: recover x from the public key h.\n`;
  explanation += `   First she checks gcd(g, n) = gcd(${g}, ${n}) = ${gGcd}.\n`;
  if (gGcd !== 1) {
    explanation += `   Since this is not 1, g is not invertible and the public parameters are invalid.\n`;
    throw new Error(
      `For Eva: g = ${g} is not invertible modulo ${n} because gcd(g, n) = ${gGcd} ≠ 1.`
    );
  }
  explanation += `   Since gcd(g, n) = 1, g has an inverse modulo n.\n\n`;

  explanation += `   She computes g⁻¹ using the extended Euclidean algorithm:\n`;
  const { inverse: gInv, steps: invSteps } = verboseModInverse(g, n);
  explanation += invSteps;

  const xEva = mod(gInv * h, n);

  explanation += `   Then x = g⁻¹ · h ≡ ${gInv} · ${h} (mod ${n}) = ${xEva}.\n\n`;
  explanation += `So the clear message is m = ${mDec}, and Eva can also recover Alice's secret key x = ${xEva}.`;

  return { m: mDec, explanation };
}
