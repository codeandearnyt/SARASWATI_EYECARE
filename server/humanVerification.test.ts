import { describe, expect, it } from "vitest";
import { createHumanVerificationChallenge, verifyHumanVerification } from "./humanVerification";

function answerFor(prompt: string) {
  const match = prompt.match(/(\d+) \+ (\d+)/);
  if (!match) throw new Error("Unexpected human-verification prompt");
  return String(Number(match[1]) + Number(match[2]));
}

describe("custom human verification", () => {
  it("accepts the signed arithmetic answer once", () => {
    const challenge = createHumanVerificationChallenge(1_000);
    expect(verifyHumanVerification(challenge.proof, answerFor(challenge.prompt), 1_001)).toBe(true);
    expect(verifyHumanVerification(challenge.proof, answerFor(challenge.prompt), 1_002)).toBe(false);
  });

  it("rejects incorrect or expired answers", () => {
    const challenge = createHumanVerificationChallenge(2_000);
    expect(verifyHumanVerification(challenge.proof, "0", 2_001)).toBe(false);
    expect(verifyHumanVerification(challenge.proof, answerFor(challenge.prompt), challenge.expiresAt)).toBe(false);
  });
});
