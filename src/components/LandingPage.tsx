import { GraduationCap, TrendingUp, Users, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  const features = [
    {
      icon: TrendingUp,
      title: "Personalized Path",
      description: "Get guidance tailored to your CGPA, interests, and goals",
    },
    {
      icon: Users,
      title: "Senior Insights",
      description: "Learn from patterns observed in past CSBS students",
    },
    {
      icon: Lightbulb,
      title: "What-If Analysis",
      description: "Simulate outcomes of different academic choices",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-8">
          <GraduationCap className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
          CSBS Decision Support System
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          A decision-support system for CSBS students based on senior experiences 
          and academic patterns. Get personalized guidance for your career path.
        </p>

        <Button
          onClick={onStart}
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-accent/25"
        >
          Start Decision Analysis
        </Button>

        <p className="text-xs text-muted-foreground mt-4 italic">
          *This is a prototype with simulated outputs for demonstration purposes
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="section-card text-center animate-fade-in"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold font-display text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
