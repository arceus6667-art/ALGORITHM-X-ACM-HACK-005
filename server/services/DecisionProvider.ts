export interface DecisionProvider {
  evaluate(): Promise<{ provider: string; limitations: string[] }>;
}
export class DeterministicDecisionProvider implements DecisionProvider {
  async evaluate() {
    return {
      provider: "Deterministic fallback",
      limitations: [
        "Jev AI is not configured: no verified API contract or credentials were supplied.",
      ],
    };
  }
}
export class JevDecisionProvider implements DecisionProvider {
  constructor(private adapter?: DecisionProvider) {}
  async evaluate() {
    try {
      if (!this.adapter) throw new Error("unconfigured");
      return await this.adapter.evaluate();
    } catch {
      return new DeterministicDecisionProvider().evaluate();
    }
  }
}
