import React from "react";
import { EditorialPage } from "../components/content/EditorialPage";
export const EnterprisePage: React.FC = () => (
  <EditorialPage
    {...{
      label: "ENTERPRISE · PLANNED",
      title: "A roadmap for governed AI workflows.",
      intro:
        "The consumer file analysis demo works today. Enterprise enforcement and provenance integrations remain planned.",
      sections: [
        {
          title: "Runtime guardrails · Planned",
          text: "A future integrated proxy could validate policies before sending content to external AI endpoints. No runtime interception or latency benchmark is implemented in this release.",
        },
        {
          title: "TraceSeal and audit events · Planned",
          text: "Signed provenance records, tenant isolation and tamper-evident event storage need a dedicated enterprise implementation and security review.",
        },
        {
          title: "Decision support · Fallback implemented",
          text: "The deterministic risk engine works without an LLM. Jev AI has no verified integration in the supplied repository; an adapter interface falls back safely when unavailable.",
        },
        {
          title: "Deployment boundary",
          text: "The prototype is not a production DLP platform. Authentication, organization roles, persistent audit storage, security evaluation and integration-specific enforcement are roadmap work.",
        },
      ],
    }}
  />
);
