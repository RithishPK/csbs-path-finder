import { MessageSquareWarning, BookOpen, Folder, Briefcase } from "lucide-react";

interface Mistake {
  text: string;
  category: "academics" | "projects" | "placements";
}

const seniorMistakes: Mistake[] = [
  {
    text: "Ignored DSA practice until final year, struggled in technical rounds",
    category: "academics",
  },
  {
    text: "Focused only on CGPA without building any practical skills",
    category: "academics",
  },
  {
    text: "Started too many projects but completed none properly",
    category: "projects",
  },
  {
    text: "Built projects without documentation—couldn't explain them in interviews",
    category: "projects",
  },
  {
    text: "Chased too many certifications instead of mastering one skill",
    category: "placements",
  },
  {
    text: "Applied to companies without researching their interview patterns",
    category: "placements",
  },
  {
    text: "Underestimated HR rounds and behavioral questions",
    category: "placements",
  },
];

const categoryConfig = {
  academics: {
    icon: BookOpen,
    label: "Academics",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  projects: {
    icon: Folder,
    label: "Projects",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  placements: {
    icon: Briefcase,
    label: "Placements",
    color: "text-success",
    bg: "bg-success/10",
  },
};

const MistakeInsights = () => {
  const groupedMistakes = seniorMistakes.reduce((acc, mistake) => {
    if (!acc[mistake.category]) {
      acc[mistake.category] = [];
    }
    acc[mistake.category].push(mistake);
    return acc;
  }, {} as Record<string, Mistake[]>);

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="section-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <MessageSquareWarning className="w-6 h-6 text-warning" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">
              Anonymous Mistake Insights
            </h2>
            <p className="text-sm text-muted-foreground">
              Learn from what seniors wish they'd done differently
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic mb-6">
          *Curated from anonymous senior feedback (prototype data)
        </p>

        <div className="space-y-6">
          {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map(
            (category) => {
              const config = categoryConfig[category];
              const mistakes = groupedMistakes[category] || [];
              const Icon = config.icon;

              if (mistakes.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">{config.label}</h3>
                  </div>
                  <div className="space-y-2 pl-10">
                    {mistakes.map((mistake, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border"
                      >
                        <span className="text-warning text-lg leading-none">"</span>
                        <p className="text-sm text-muted-foreground italic">
                          {mistake.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default MistakeInsights;
