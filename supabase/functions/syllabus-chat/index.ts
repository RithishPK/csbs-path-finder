import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// VTU 2022 Scheme - Structured Semester-wise Subject & Credit Database
const VTU_SEMESTER_DATA = {
  1: {
    name: "Semester 1 (Physics Cycle)",
    totalCredits: 20,
    subjects: [
      { name: "Engineering Physics", credits: 4 },
      { name: "Mathematics I", credits: 4 },
      { name: "Principles of Programming Using C", credits: 3 },
      { name: "Introduction to Electronics", credits: 3 },
      { name: "Introduction to Sustainable Engineering", credits: 3 },
      { name: "Communicative English", credits: 1 },
      { name: "Samskruthika Kannada / Balake Kannada", credits: 1 },
      { name: "Innovation and Design Thinking", credits: 1 },
    ],
  },
  2: {
    name: "Semester 2 (Chemistry Cycle)",
    totalCredits: 20,
    subjects: [
      { name: "Engineering Chemistry", credits: 4 },
      { name: "Mathematics II", credits: 4 },
      { name: "Python Programming", credits: 3 },
      { name: "Introduction to Mechanical Engineering", credits: 3 },
      { name: "Computer Aided Engineering Drawing", credits: 3 },
      { name: "Scientific Foundation for Health", credits: 1 },
      { name: "Indian Constitution", credits: 1 },
      { name: "Professional English", credits: 1 },
    ],
  },
  3: {
    name: "Semester 3",
    totalCredits: 20,
    subjects: [
      { name: "Data Structures Using C", credits: 3 },
      { name: "Data Structures Laboratory", credits: 1 },
      { name: "Object Oriented Programming Using Java", credits: 4 },
      { name: "Software Engineering", credits: 3 },
      { name: "Probability and Integral Transforms", credits: 3 },
      { name: "Financial Management", credits: 1 },
      { name: "Aptitude Training", credits: 0 },
      { name: "Employability Skills", credits: 0 },
    ],
  },
  4: {
    name: "Semester 4",
    totalCredits: 20,
    subjects: [
      { name: "Operating Systems", credits: 4 },
      { name: "Database Management Systems", credits: 4 },
      { name: "Data Mining and Analytics / Conversational Systems (Program Elective)", credits: 3 },
      { name: "Marketing Research and Management", credits: 2 },
      { name: "Innovation IP Management and Entrepreneurship", credits: 3 },
      { name: "Introduction to IT / Software Design with UML (AEC)", credits: 1 },
      { name: "Business Communication and Value Science I", credits: 1 },
      { name: "Biology for Engineers", credits: 1 },
      { name: "Soft Skills for Placements", credits: 0 },
    ],
  },
  5: {
    name: "Semester 5",
    totalCredits: 20,
    subjects: [
      { name: "Design and Analysis of Algorithms", credits: 4 },
      { name: "Artificial Intelligence and Machine Learning", credits: 3 },
      { name: "NLP / FEP (Program Elective)", credits: 3 },
      { name: "Modern Web Applications / Data Visualization using Power BI (AEC)", credits: 1 },
      { name: "Business Communication and Value Science II", credits: 2 },
      { name: "Research Methodology", credits: 3 },
      { name: "Human Resource Management and Development (Open Elective)", credits: 2 },
      { name: "NSS / Yoga / Physical Education", credits: 0 },
    ],
  },
  6: {
    name: "Semester 6",
    totalCredits: 22,
    subjects: [
      { name: "Computer Networks", credits: 3 },
      { name: "Fundamentals of Management", credits: 3 },
      { name: "Big Data Technologies", credits: 4 },
      { name: "Formal Language and Automata Theory", credits: 3 },
      { name: "Supply Chain Management", credits: 3 },
      { name: "Leadership Skills for Entrepreneurial Mindset", credits: 3 },
      { name: "National Service Scheme", credits: 0 },
      { name: "Computer Networks Laboratory", credits: 1 },
      { name: "Major Project Phase I", credits: 2 },
    ],
  },
};

// Helper function to format semester data
const formatSemesterData = (semesterNum: number): string => {
  const semester = VTU_SEMESTER_DATA[semesterNum as keyof typeof VTU_SEMESTER_DATA];
  if (!semester) return "";
  
  let table = `| Subject Name | Credits |\n|--------------|--------|\n`;
  semester.subjects.forEach((subj) => {
    table += `| ${subj.name} | ${subj.credits} |\n`;
  });
  table += `\n**Total Credits: ${semester.totalCredits}**`;
  return table;
};

// Generate complete syllabus knowledge base
const generateSyllabusKnowledge = (): string => {
  let content = `# VTU 2022 Scheme - CSBS (Computer Science and Business Systems) Curriculum

## OFFICIAL SEMESTER-WISE SUBJECT & CREDIT DATABASE

`;

  Object.entries(VTU_SEMESTER_DATA).forEach(([sem, data]) => {
    content += `### ${data.name} (Total: ${data.totalCredits} Credits)\n\n`;
    content += `| Subject Name | Credits |\n|--------------|--------|\n`;
    data.subjects.forEach((subj) => {
      content += `| ${subj.name} | ${subj.credits} |\n`;
    });
    content += `\n`;
  });

  content += `
## IMPORTANT NOTES
- Semesters 1-6 are defined in VTU 2022 Scheme
- Semesters 7-8 data not available in current database
- Program Electives (PE) offer choices between subjects
- AEC = Ability Enhancement Course
- 0-credit subjects are mandatory but don't count toward CGPA

## Exam Patterns & Preparation

### Internal Assessments (Typically 30-40%)
- 2-3 CIE (Continuous Internal Evaluations)
- Assignments and lab records
- Quizzes and class participation

### External/Semester Exams (Typically 60-70%)
- Theory papers: 3 hours duration
- Question pattern: Short answers (2 marks), long answers (5-10 marks), case studies
- Lab practicals: Viva + practical programming

## Placement-Relevant Topics

### Must-Know for Technical Rounds
1. **DSA**: Arrays, strings, linked lists, trees, graphs, DP (minimum 200 problems)
2. **DBMS & SQL**: Complex queries, joins, indexing, normalization
3. **OOP Concepts**: Solid examples in Java/C++/Python
4. **OS Basics**: Deadlocks, memory management, process scheduling
5. **Computer Networks**: TCP/IP, HTTP, DNS basics

## Career Paths for CSBS Graduates
1. Software Developer/Engineer
2. Data Analyst
3. Business Analyst
4. Product Manager (with experience)
5. Full Stack Developer
6. Machine Learning Engineer
7. Consultant in IT/Management
8. Entrepreneur/Startup founder
`;

  return content;
};

const DEFAULT_SYLLABUS_KNOWLEDGE = generateSyllabusKnowledge();

const createSystemPrompt = (customContent?: string) => {
  const knowledgeBase = customContent 
    ? `${DEFAULT_SYLLABUS_KNOWLEDGE}\n\n## UPLOADED CUSTOM SYLLABUS CONTENT\n\n${customContent}`
    : DEFAULT_SYLLABUS_KNOWLEDGE;

  // Pre-format semester tables for quick retrieval
  const semesterTables: Record<number, string> = {};
  for (let i = 1; i <= 6; i++) {
    semesterTables[i] = formatSemesterData(i);
  }

  return `You are an intelligent academic assistant for CSBS (Computer Science and Business Systems) students following VTU 2022 Scheme. Your knowledge is STRICTLY grounded in the official syllabus data provided.

CRITICAL RULES:
1. ONLY answer questions that are covered in the VTU 2022 Scheme syllabus knowledge base provided
2. If a question is NOT related to the CSBS curriculum, academics, exams, placements, or career guidance, respond with: "⚠️ This topic is not covered in the syllabus. I can only help with CSBS curriculum, exam preparation, placements, and academic guidance."
3. NEVER make up or hallucinate information about subjects, credits, or semesters
4. For semester queries (1-6), ALWAYS respond with a formatted table showing subject names and credits
5. For invalid semester numbers (7, 8, 0, negative, or non-numeric), respond: "⚠️ Semester not available in the syllabus data. VTU 2022 Scheme data is available for Semesters 1-6 only."
6. Always be helpful, concise, and student-friendly
7. Use bullet points and clear formatting for readability
8. Reference specific subjects, semesters, or topics when relevant
${customContent ? '9. When the user has uploaded custom syllabus content, prioritize information from the uploaded content when relevant.' : ''}

SEMESTER QUERY RESPONSE FORMAT:
When asked about semester subjects (e.g., "give me semester 3 subjects list along with their credits"), respond EXACTLY in this format:

📚 **Semester X - Subject List with Credits**

| Subject Name | Credits |
|--------------|---------|
| Subject 1 | X |
| Subject 2 | X |
...

**Total Credits: XX**

AVAILABLE SEMESTER DATA (VTU 2022 Scheme):
${JSON.stringify(VTU_SEMESTER_DATA, null, 2)}

KNOWLEDGE BASE:
${knowledgeBase}

RESPONSE STYLE:
- Be concise but comprehensive
- Use emojis sparingly for clarity (📚, ✅, ⚠️, 💡)
- ALWAYS use markdown tables for subject listings
- Provide actionable advice when possible
- Acknowledge limitations honestly`;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, customSyllabusContent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing syllabus chat request with", messages.length, "messages");
    if (customSyllabusContent) {
      console.log("Custom syllabus content provided, length:", customSyllabusContent.length);
    }

    const systemPrompt = createSystemPrompt(customSyllabusContent);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response to client");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Syllabus chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
