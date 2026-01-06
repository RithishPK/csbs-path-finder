import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlaskConical, Gauge, Zap, TrendingUp } from "lucide-react";

interface SimulationResult {
  risk: "Low" | "Medium" | "High";
  effort: string;
  benefit: string;
}

const decisions = [
  {
    id: "elective-ml",
    label: "Choose Machine Learning as elective",
    category: "Elective choice",
  },
  {
    id: "elective-cloud",
    label: "Choose Cloud Computing as elective",
    category: "Elective choice",
  },
  {
    id: "cert-aws",
    label: "Pursue AWS Certification",
    category: "Certification focus",
  },
  {
    id: "cert-ds",
    label: "Complete Data Science specialization",
    category: "Certification focus",
  },
  {
    id: "project-research",
    label: "Focus on research-based project",
    category: "Project type",
  },
  {
    id: "project-industry",
    label: "Build industry-oriented project",
    category: "Project type",
  },
];

const mockResults: Record<string, SimulationResult> = {
  "elective-ml": {
    risk: "Low",
    effort: "Moderate (10-12 hrs/week for self-study beyond classes)",
    benefit: "Highly valued in data roles; strong foundation for AI/ML careers. Opens doors to product companies focused on AI.",
  },
  "elective-cloud": {
    risk: "Low",
    effort: "Moderate (hands-on lab work required)",
    benefit: "Cloud skills are universally demanded. Pairs well with DevOps and full-stack roles. Quick ROI in interviews.",
  },
  "cert-aws": {
    risk: "Medium",
    effort: "High (60-80 hours of preparation)",
    benefit: "Industry-recognized credential. Best suited if targeting cloud architect or DevOps roles. May be overkill for general SDE positions.",
  },
  "cert-ds": {
    risk: "Medium",
    effort: "Very High (3-6 months part-time)",
    benefit: "Comprehensive knowledge but time-intensive. Best for career pivots into analytics/ML. Consider if you have bandwidth.",
  },
  "project-research": {
    risk: "High",
    effort: "Very High (novelty and paper writing required)",
    benefit: "Essential for higher studies applications. May not directly help in industry placements unless published. Best for MS/PhD aspirants.",
  },
  "project-industry": {
    risk: "Low",
    effort: "Moderate to High (depends on scope)",
    benefit: "Directly applicable in interviews. Demonstrates practical skills. Highly recommended for placement-focused students.",
  },
};

const WhatIfSimulator = () => {
  const [selectedDecision, setSelectedDecision] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = () => {
    if (selectedDecision && mockResults[selectedDecision]) {
      setResult(mockResults[selectedDecision]);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "risk-low";
      case "Medium":
        return "risk-medium";
      case "High":
        return "risk-high";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="section-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">
              What-If Simulator
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore outcomes of different decisions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Select value={selectedDecision} onValueChange={setSelectedDecision}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="What decision do you want to simulate?" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {decisions.map((decision) => (
                <SelectItem key={decision.id} value={decision.id}>
                  <span className="text-muted-foreground text-xs">
                    {decision.category}:
                  </span>{" "}
                  {decision.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleSimulate}
            disabled={!selectedDecision}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Simulate Outcome
          </Button>
        </div>

        {result && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <p className="text-xs text-muted-foreground italic text-center">
              *Simulated output based on prototype logic
            </p>

            <div className="grid gap-4">
              {/* Risk Level */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(
                      result.risk
                    )}`}
                  >
                    {result.risk}
                  </span>
                </div>
              </div>

              {/* Effort Required */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Effort Required</p>
                  <p className="font-medium text-foreground">{result.effort}</p>
                </div>
              </div>

              {/* Expected Benefit */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Expected Benefit</p>
                  <p className="font-medium text-foreground">{result.benefit}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfSimulator;
