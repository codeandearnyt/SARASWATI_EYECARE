import { describe, expect, it } from "vitest";
import { isHumanVerificationComplete } from "../client/src/lib/appointmentVerification";

describe("appointment human-check completion", () => {
  const challenge = { proof: "signed-proof" };

  it("requires a loaded challenge, an answer, and the explicit human confirmation", () => {
    expect(isHumanVerificationComplete(challenge, "", false)).toBe(false);
    expect(isHumanVerificationComplete(challenge, "7", false)).toBe(false);
    expect(isHumanVerificationComplete(challenge, "", true)).toBe(false);
    expect(isHumanVerificationComplete(undefined, "7", true)).toBe(false);
    expect(isHumanVerificationComplete(challenge, " 7 ", true)).toBe(true);
  });
});
