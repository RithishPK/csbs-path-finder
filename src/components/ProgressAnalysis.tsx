import { Progress } from "@/components/ui/progress";
import { BarChart3, AlertCircle, CheckCircle2 } from "lucide-react";

const mockGaps = [
  { area: "Data Structures & Algorithms", status: "gap", detail: "Need 150+ more problems" },
  { area: "System Design Basics", status: "gap", detail: "Not started yet" },
  { area: "Communication Skills", status: "partial", detail: "Basic level achieved" },
  { area: "Resume & Portfolio", status: "completed", detail: "Well prepared" },
  { area: "Aptitude Preparation", status: "partial", detail: "Quantitative needs work" },
  { area: "Technical Interview Practice", status: "gap", detail: "Only 3 mock interviews done" },
];

const ProgressAnalysis = () => {
  const readinessScore = 62;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "partial":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "gap":
        return <AlertCircle className="w-5 h-5 text-danger" />;
      default:
        return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 border-success/20";
      case "partial":
        return "bg-warning/10 border-warning/20";
      case "gap":
        return "bg-danger/10 border-danger/20";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="section-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">
              Progress & Gap Analysis
            </h2>
            <p className="text-xs text-muted-foreground italic">
              *Simulated analysis based on prototype logic
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Placement Readiness
            </span>
            <span className="text-2xl font-bold text-primary">{readinessScore}%</span>
          </div>
          <Progress value={readinessScore} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            Based on comparison with placement-successful CSBS students
          </p>
        </div>

        {/* Gap Areas */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Area-wise Assessment
          </h3>
          {mockGaps.map((gap, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusBg(
                gap.status
              )}`}
            >
              {getStatusIcon(gap.status)}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{gap.area}</p>
                <p className="text-xs text-muted-foreground">{gap.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-muted/50 rounded-xl">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Analysis Note:</strong> This assessment
            is based on patterns observed from past CSBS students who successfully
            secured placements. The gaps identified are areas where most successful
            candidates had demonstrated proficiency. Focus on high-priority gaps first.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalysis;
