/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import LandingPage from "@/src/app/(marketing)/page";
import AssessmentPage from "@/src/app/(app)/assessment/page";
import RoadmapPage from "@/src/app/(app)/roadmap/page";
import DashboardPage from "@/src/app/(app)/dashboard/page";
import MockInterviewPage from "@/src/app/(app)/mock-interview/page";
import GatePage from "@/src/app/(app)/gate/page";
import JobsPage from "@/src/app/(app)/jobs/page";
import LoginPage from "@/src/app/(auth)/login/page";
import { AuthProvider } from "@/src/lib/auth-context";
import NorthChat from "@/src/components/NorthChat";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/mock-interview" element={<MockInterviewPage />} />
              <Route path="/gate" element={<GatePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <Footer />
          <NorthChat />
        </div>
      </AuthProvider>
    </Router>
  );
}
