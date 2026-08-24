export type VerificationChallenge = { proof: string } | undefined;

export function isHumanVerificationComplete(
  challenge: VerificationChallenge,
  answer: string,
  checked: boolean,
) {
  return Boolean(challenge && answer.trim() && checked);
}
