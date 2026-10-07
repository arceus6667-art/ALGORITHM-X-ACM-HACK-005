import React from "react";
import { EditorialPage } from "../components/content/EditorialPage";
export const AboutPage: React.FC = () => (
  <EditorialPage
    {...{
      label: "ABOUT AGENTTRAP",
      title: "Make privacy decisions inspectable.",
      intro:
        "AgentTrap explores practical file analysis and transparent policy context before sharing.",
      sections: [
        {
          title: "Working scope",
          text: "The hackathon prototype parses supported uploads and computes reproducible exposure assessments. Every result distinguishes detected patterns from documented policy and inference.",
        },
        {
          title: "Our research direction",
          text: "TraceSeal provenance, runtime controls and optional bounded AI assistance are planned. We show their implementation status so users and judges can assess the product accurately.",
        },
        {
          title: "What we cannot see",
          text: "AgentTrap has no privileged visibility inside Google, Meta, OpenAI or another provider. It cannot confirm that an uploaded file was used in training, forwarded or deleted by a third party.",
        },
      ],
    }}
  />
);
