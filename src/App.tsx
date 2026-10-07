/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { Navbar } from "./components/navigation/Navbar";
import { Footer } from "./components/common/Footer";
import { ScrollToTop } from "./components/common/ScrollToTop";

import { HomePage } from "./pages/HomePage";
import { DemoPage } from "./pages/DemoPage";
import { ProductPage } from "./pages/ProductPage";
import { IndividualsPage } from "./pages/IndividualsPage";
import { EnterprisePage } from "./pages/EnterprisePage";
import { TechnologyPage } from "./pages/TechnologyPage";
import { ResearchPage } from "./pages/ResearchPage";
import { DocsPage } from "./pages/DocsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDemoRoute = location.pathname.startsWith("/demo");

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-white">
      <ScrollToTop />

      {/* For /demo route, DemoPage renders its own minimalist header as required */}
      {!isDemoRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/individuals" element={<IndividualsPage />} />
          <Route path="/enterprise" element={<EnterprisePage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Fallback to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isDemoRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
