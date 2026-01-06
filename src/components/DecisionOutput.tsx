import { StudentData } from "./StudentInputForm";
import { CheckCircle, AlertTriangle, Target } from "lucide-react";

interface DecisionOutputProps {
  data: StudentData;
}

interface Guidance {
  path: string;
  reasons: string[];
  avoid: string[];
}

const generateGuidance = (data: StudentData): Guidance => {
  const { cgpa, interests, hasInternship, targetCompany } = data;

  // Mock decision logic
  if (cgpa < 7.5 && targetCompany === "service") {
    return {
      path: "Focus on Core Skills & Service Company Preparation",
      reasons: [
        "Service companies prioritize aptitude and communication skills",
        "Your CGPA meets the typical cutoff for mass recruiters",
        "Focus on improving problem-solving through regular practice",
        "Group discussions and soft skills will be differentiators",
      ],
      avoid: [
        "Don't ignore aptitude preparation until the last moment",
        "Avoid focusing only on coding without soft skill development",
        "Don't underestimate the importance of mock interviews",
      ],
    };
  }

  if (cgpa >= 8 && targetCompany === "product") {
    return {
      path: "Product Company Track: DSA + System Design Focus",
      reasons: [
        "Your strong CGPA opens doors to top product companies",
        "DSA mastery is essential—aim for 300+ problems on LeetCode",
        "System design knowledge will set you apart in interviews",
        interests.includes("Core Tech")
          ? "Your interest in Core Tech aligns perfectly"
          : "Consider deepening your technical foundation",
      ],
      avoid: [
        "Don't spread too thin across multiple technologies",
        "Avoid neglecting behavioral interview preparation",
        "Don't skip fundamental CS concepts for interview hacks",
      ],
    };
  }

  if (targetCompany === "startup") {
    return {
      path: "Startup Ready: Build Fast, Learn Faster",
      reasons: [
        "Startups value practical project experience over grades",
        "Build 2-3 solid full-stack projects to showcase",
        hasInternship
          ? "Your internship experience is a plus"
          : "Consider contributing to open source to gain experience",
        "Communication and ownership mindset matter here",
      ],
      avoid: [
        "Don't focus only on theoretical knowledge",
        "Avoid waiting for perfect opportunities—start building now",
        "Don't underestimate the importance of networking",
      ],
    };
  }

  if (targetCompany === "higher-studies") {
    return {
      path: "Higher Studies Preparation Track",
      reasons: [
        cgpa >= 8
          ? "Your CGPA is competitive for top programs"
          : "Focus on improving CGPA in remaining semesters",
        "Start GRE/GATE preparation based on your target",
        "Research papers and projects strengthen applications",
        "Build relationships with professors for recommendations",
      ],
      avoid: [
        "Don't delay standardized test preparation",
        "Avoid generic SOPs—personalize your story",
        "Don't ignore work experience if targeting MBA",
      ],
    };
  }

  // Default path
  return {
    path: "Balanced Preparation: Explore & Strengthen",
    reasons: [
      "Explore different domains to find your passion",
      "Build a diverse project portfolio",
      hasInternship
        ? "Leverage your internship experience"
        : "Prioritize getting an internship soon",
      "Network with seniors and alumni for guidance",
    ],
    avoid: [
      "Don't wait until final year to start preparation",
      "Avoid comparison—focus on your own journey",
      "Don't neglect core CS fundamentals",
    ],
  };
};

const DecisionOutput = ({ data }: DecisionOutputProps) => {
  const guidance = generateGuidance(data);

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="section-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">
              Recommended Path
            </h2>
            <p className="text-xs text-muted-foreground italic">
              *Simulated output based on prototype logic
            </p>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <p className="text-lg font-semibold text-foreground">{guidance.path}</p>
        </div>

        <div className="space-y-6">
          {/* Why this path */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
              <CheckCircle className="w-5 h-5 text-success" />
              Why this path
            </h3>
            <ul className="space-y-2">
              {guidance.reasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* What to avoid */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              What to avoid
            </h3>
            <ul className="space-y-2">
              {guidance.avoid.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionOutput;
