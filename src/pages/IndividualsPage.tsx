import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, Shield, FileText, CheckCircle2 } from "lucide-react";

export const IndividualsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-16">
      {/* Hero */}
      <section className="space-y-4">
        <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
          Personal Privacy Intelligence
        </div>
        <h1 className="text-4xl sm:text-5xl font-[550] tracking-tight text-[#111111] leading-[1.12]">
          Understand what your data reveals.
        </h1>
        <p className="text-[17px] text-[#606060] leading-relaxed max-w-2xl">
          When you upload a photo or document to a web service, you often share
          much more than just the visible subject. AgentTrap gives you
          visibility into hidden signals before you hit send.
        </p>
        <div className="pt-2">
          <Link
            to="/demo"
            className="px-5 py-2.5 bg-[#111111] text-white rounded text-xs font-medium hover:bg-[#222222] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Try Personal Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Educational Explanations */}
      <section className="pt-12 border-t border-[#E8E8E6] space-y-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111111]">
            1. File Analysis & Identifiable Signals
          </h2>
          <p className="text-sm text-[#606060] leading-relaxed">
            Every file contains explicit and implicit information. A casual
            photo taken outdoors may include facial geometry, school or employer
            logos on clothing, background street signs, and reflections. This
            prototype extracts readable English text and supported metadata; it
            does not classify faces, logos or objects.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111111]">
            2. Metadata Awareness
          </h2>
          <p className="text-sm text-[#606060] leading-relaxed">
            Cameras and smartphones automatically embed Exchangeable Image File
            Format (EXIF) tags, including exact GPS coordinates, timestamp of
            capture, camera serial number, and device models. Documents often
            retain author identities and revision histories. AgentTrap
            identifies metadata entropy before external transmission.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111111]">
            3. Platform Context & Potential Uses
          </h2>
          <p className="text-sm text-[#606060] leading-relaxed">
            Privacy risk depends heavily on where a file is sent. Sharing an
            image to an end-to-end encrypted messaging thread carries very
            different exposure characteristics than posting to an
            advertising-supported social feed or uploading into a commercial AI
            training endpoint. AgentTrap maps risk specifically to the
            destination you select.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#111111]">
            4. Safe Sharing Suggestions
          </h2>
          <p className="text-sm text-[#606060] leading-relaxed">
            Before uploading, consider:
          </p>
          <ul className="space-y-2 text-xs text-[#606060] pl-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
              <span>
                Strip EXIF location metadata before uploading images to public
                forums.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
              <span>
                Mask badges, credentials, and financial metrics in screenshots.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
              <span>
                Opt out of model training data collection where platform
                settings permit.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pt-8 border-t border-[#E8E8E6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#111111]">
            Test your files in the sandbox.
          </h3>
          <p className="text-xs text-[#8A8A8A]">
            No login required. Server-side parsing without external AI upload.
          </p>
        </div>
        <Link
          to="/demo"
          className="px-5 py-2.5 bg-[#111111] text-white rounded text-xs font-medium hover:bg-[#222222] transition-colors inline-flex items-center gap-1.5"
        >
          <span>Open Demo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
};
