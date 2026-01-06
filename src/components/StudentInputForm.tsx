import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight } from "lucide-react";

export interface StudentData {
  cgpa: number;
  semester: string;
  interests: string[];
  hasInternship: boolean;
  targetCompany: string;
}

interface StudentInputFormProps {
  onSubmit: (data: StudentData) => void;
}

const interestOptions = [
  "Data Science",
  "Cybersecurity",
  "Product",
  "Core Tech",
  "Management",
];

const StudentInputForm = ({ onSubmit }: StudentInputFormProps) => {
  const [cgpa, setCgpa] = useState("");
  const [semester, setSemester] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [hasInternship, setHasInternship] = useState<boolean | null>(null);
  const [targetCompany, setTargetCompany] = useState("");

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cgpa && semester && interests.length > 0 && hasInternship !== null && targetCompany) {
      onSubmit({
        cgpa: parseFloat(cgpa),
        semester,
        interests,
        hasInternship,
        targetCompany,
      });
    }
  };

  const isValid = cgpa && semester && interests.length > 0 && hasInternship !== null && targetCompany;

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="section-card">
        <h2 className="text-2xl font-bold font-display text-foreground mb-2">
          Student Profile
        </h2>
        <p className="text-muted-foreground mb-6">
          Fill in your details to get personalized guidance
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CGPA */}
          <div className="space-y-2">
            <Label htmlFor="cgpa" className="text-sm font-medium">
              Current CGPA
            </Label>
            <Input
              id="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g., 8.5"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="bg-background"
            />
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Semester</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Areas of Interest</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <label
                  key={interest}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    interests.includes(interest)
                      ? "bg-primary/10 border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  <Checkbox
                    checked={interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <span className="text-sm">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Internship Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Have you completed any internship?
            </Label>
            <RadioGroup
              value={hasInternship === null ? "" : hasInternship ? "yes" : "no"}
              onValueChange={(val) => setHasInternship(val === "yes")}
              className="flex gap-4"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="yes" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="no" />
                <span>No</span>
              </label>
            </RadioGroup>
          </div>

          {/* Target Company */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Target Company Type</Label>
            <Select value={targetCompany} onValueChange={setTargetCompany}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="service">Service Company</SelectItem>
                <SelectItem value="product">Product Company</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="higher-studies">Higher Studies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 rounded-xl"
          >
            Generate Guidance
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StudentInputForm;
