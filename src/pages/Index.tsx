import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import Navigation from "@/components/Navigation";
import StudentInputForm, { StudentData } from "@/components/StudentInputForm";
import DecisionOutput from "@/components/DecisionOutput";
import WhatIfSimulator from "@/components/WhatIfSimulator";
import ProgressAnalysis from "@/components/ProgressAnalysis";
import MistakeInsights from "@/components/MistakeInsights";
import Chatbot from "@/components/Chatbot";
import SyllabusAISection from "@/components/SyllabusAISection";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home");
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    setCurrentSection("input");
  };

  const handleFormSubmit = (data: StudentData) => {
    setStudentData(data);
    setCurrentSection("guidance");
  };

  const handleNavigate = (section: string) => {
    if (section === "home") {
      setHasStarted(false);
      setStudentData(null);
    }
    setCurrentSection(section);
  };

  const renderContent = () => {
    switch (currentSection) {
      case "home":
        return <LandingPage onStart={handleStart} />;
      case "input":
        return <StudentInputForm onSubmit={handleFormSubmit} />;
      case "guidance":
        return studentData ? (
          <DecisionOutput data={studentData} />
        ) : (
          <StudentInputForm onSubmit={handleFormSubmit} />
        );
      case "simulator":
        return <WhatIfSimulator />;
      case "progress":
        return <ProgressAnalysis />;
      case "mistakes":
        return <MistakeInsights />;
      case "syllabus-ai":
        return <SyllabusAISection />;
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentSection={currentSection}
        onNavigate={handleNavigate}
        showNav={hasStarted}
      />
      <main className="pb-8">{renderContent()}</main>
      {/* Legacy FAQ Chatbot - bottom left */}
      <Chatbot />
    </div>
  );
};

export default Index;
