# AgentTrap CRM 0.3.2 verification

This update adds the isolated administrator exposure simulation, a 19-section operating guide and browser companion 0.2.0 success feedback.

All twelve automated tests passed in the development environment on 2026-10-08 UTC. The GitHub release verification gate passed; native Windows, macOS and Linux x64/ARM64 Trial and Full assets were produced.

## Automated acceptance coverage

- Six simulation scenarios use current console rules where applicable; hypothetical downstream events are explicitly labelled.
- Protection on/off changes only modeled outcomes. Risk remains unavailable in the checker-offline exercise.
- Step progression completes a separate incident ledger; simulated administrator approval and acknowledgement work.
- Exported JSON contains `simulated: true` and `dryRun: true`.
- Simulated runs, employee additions, approvals and resets do not mutate analytical assets, policies or live audit events.
- The actual company roster uses only existing `me` and `dashboard` read operations; it does not replace fictional employees or grant roles.
- User-supplied employee names are escaped in the rendered table.
- Browser companion pairing and website permission enablement display separate success messages; permission rejection shows an error.
- All 19 documentation sections render in the CRM.
- Existing account, quota, policy, audit, companion enforcement and web-trial tests remain part of `npm test`.

## Runtime boundaries

The user reports that actual browser observations are visible on their laptop. This verifies their observed capture path, not every provider interface or prevention outcome. New native packages still require installation and on-device acceptance. The simulation sends no AI requests or phone notifications and performs no production containment. Actual phone receipt, supported provider controls and installer provenance remain device-dependent checks described in the operator guide.

The test harness now waits for completed asynchronous observer and form operations instead of assuming cryptographic work always finishes within 30 milliseconds.
