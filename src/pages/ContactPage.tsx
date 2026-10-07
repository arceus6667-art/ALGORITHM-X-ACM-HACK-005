import React from "react";
import { EditorialPage } from "../components/content/EditorialPage";
export const ContactPage: React.FC = () => (
  <EditorialPage
    {...{
      label: "CONTACT · NOT CONFIGURED",
      title: "Talk with the project team.",
      intro:
        "A contact delivery service has not been connected in this prototype.",
      sections: [
        {
          title: "During the hackathon",
          text: "Ask the presenting team directly for a walkthrough, research discussion or project contact details. This page does not collect contact information or pretend to send messages.",
        },
      ],
    }}
  />
);
