import React from "react";
import { Link } from "react-router-dom";
export const EditorialPage: React.FC<{
  label: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; text: string }>;
  children?: React.ReactNode;
}> = ({ label, title, intro, sections, children }) => (
  <div className="max-w-4xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
    <div className="eyebrow">{label}</div>
    <h1 className="text-4xl sm:text-5xl font-[550] tracking-tight leading-[1.12] mb-5">
      {title}
    </h1>
    <p className="text-base text-[#606060] leading-relaxed max-w-2xl mb-10">
      {intro}
    </p>
    {sections.map((s) => (
      <section key={s.title} className="py-7 border-t border-[#E8E8E6]">
        <h2 className="text-lg font-semibold mb-3">{s.title}</h2>
        <p className="text-sm text-[#606060] leading-relaxed">{s.text}</p>
      </section>
    ))}
    {children}
    <div className="flex flex-col sm:flex-row gap-3 mt-10">
      <Link className="primary-button" to="/demo">
        Try Demo →
      </Link>
      <Link className="secondary-button" to="/research">
        Explore Methodology
      </Link>
    </div>
  </div>
);
