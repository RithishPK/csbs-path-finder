import { Home, FileText, Target, FlaskConical, BarChart3, MessageSquareWarning, GraduationCap } from "lucide-react";

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  showNav: boolean;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "input", label: "Profile", icon: FileText },
  { id: "guidance", label: "Guidance", icon: Target },
  { id: "simulator", label: "Simulator", icon: FlaskConical },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "mistakes", label: "Insights", icon: MessageSquareWarning },
  { id: "syllabus-ai", label: "Syllabus AI", icon: GraduationCap },
];

const Navigation = ({ currentSection, onNavigate, showNav }: NavigationProps) => {
  if (!showNav) return null;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-link flex items-center gap-2 whitespace-nowrap ${
                  isActive ? "nav-link-active" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
