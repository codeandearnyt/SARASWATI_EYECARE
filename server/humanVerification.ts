import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const usedProofs = new Map<string, number>();

type HumanChallenge = {
  prompt: string;
  proof: string;
  expiresAt: number;
};

function valuesFor(nonce: string) {
  const total = nonce.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return { first: 2 + (total % 8), second: 1 + (Math.floor(total / 8) % 8) };
}

function signingKey() {
  return process.env.JWT_SECRET || "local-development-human-verification-key";
}

function signature(nonce: string, expiresAt: number, expectedAnswer: number) {
  return createHmac("sha256", signingKey()).update(`${nonce}:${expiresAt}:${expectedAnswer}`).digest("base64url");
}

function clearExpiredProofs(now: number) {
  usedProofs.forEach((expiresAt, proof) => {
    if (expiresAt <= now) usedProofs.delete(proof);
  });
}

export function createHumanVerificationChallenge(now = Date.now()): HumanChallenge {
  const nonce = randomBytes(18).toString("base64url");
  const expiresAt = now + CHALLENGE_TTL_MS;
  const { first, second } = valuesFor(nonce);
  const expectedAnswer = first + second;
  return {
    prompt: `What is ${first} + ${second}?`,
    proof: `${nonce}.${expiresAt}.${signature(nonce, expiresAt, expectedAnswer)}`,
    expiresAt,
  };
}

export function verifyHumanVerification(proof: string, answer: string, now = Date.now()) {
  clearExpiredProofs(now);
  const [nonce, expiryText, receivedSignature, ...extra] = proof.split(".");
  const expiresAt = Number(expiryText);
  const numericAnswer = Number(answer);
  if (!nonce || !receivedSignature || extra.length > 0 || !Number.isSafeInteger(expiresAt) || expiresAt <= now || !Number.isSafeInteger(numericAnswer)) return false;

  const { first, second } = valuesFor(nonce);
  const expectedSignature = signature(nonce, expiresAt, first + second);
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected) || numericAnswer !== first + second || usedProofs.has(proof)) return false;

  usedProofs.set(proof, expiresAt);
  return true;
}
