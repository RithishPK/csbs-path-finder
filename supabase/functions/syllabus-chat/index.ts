import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Comprehensive CSBS syllabus knowledge base - grounded content
const SYLLABUS_KNOWLEDGE = `
# CSBS (Computer Science and Business Systems) Curriculum Knowledge Base

## Semester-wise Core Subjects

### Semester 1-2 (Foundation Year)
- **Mathematics for Computing**: Linear algebra, calculus, probability, statistics
- **Programming Fundamentals**: C programming, Python basics, logic building
- **Computer Fundamentals**: Hardware basics, operating systems introduction
- **Communication Skills**: Technical writing, presentation skills
- **Business Fundamentals**: Introduction to economics, business environment

### Semester 3-4 (Core Development)
- **Data Structures & Algorithms (DSA)**: Arrays, linked lists, trees, graphs, sorting, searching, dynamic programming
- **Database Management Systems (DBMS)**: SQL, normalization, ER diagrams, transactions, indexing
- **Object-Oriented Programming**: Java/C++, inheritance, polymorphism, abstraction, encapsulation
- **Operating Systems**: Process management, memory management, file systems, scheduling
- **Discrete Mathematics**: Logic, sets, relations, graph theory, combinatorics
- **Accounting & Financial Management**: Balance sheets, P&L, financial ratios, budgeting

### Semester 5-6 (Specialization)
- **Machine Learning Fundamentals**: Supervised/unsupervised learning, regression, classification, clustering
- **Data Analytics**: Statistical analysis, visualization, data preprocessing, feature engineering
- **Computer Networks**: OSI model, TCP/IP, network protocols, security basics
- **Web Technologies**: HTML, CSS, JavaScript, React/Angular basics, REST APIs
- **Business Intelligence**: Data warehousing, ETL, reporting, dashboards
- **Operations Research**: Linear programming, optimization, decision theory

### Semester 7-8 (Advanced & Project)
- **Cloud Computing**: AWS/Azure basics, deployment, serverless, containers
- **Cybersecurity**: Threats, encryption, authentication, secure coding
- **Project Management**: Agile, Scrum, project planning, risk management
- **Entrepreneurship**: Business models, startup fundamentals, innovation
- **Major Project**: Industry-relevant capstone project
- **Internship**: 6-8 weeks mandatory industry internship

## Exam Patterns & Preparation

### Internal Assessments (Typically 30-40%)
- 2-3 CIE (Continuous Internal Evaluations)
- Assignments and lab records
- Quizzes and class participation

### External/Semester Exams (Typically 60-70%)
- Theory papers: 3 hours duration
- Question pattern: Short answers (2 marks), long answers (5-10 marks), case studies
- Lab practicals: Viva + practical programming

### Subject Difficulty Levels (Based on Senior Feedback)
- **High Difficulty**: Statistics, Machine Learning theory, Operations Research
- **Moderate**: DSA, DBMS, Computer Networks
- **Manageable**: Business subjects, Web Technologies, Communication

## Placement-Relevant Topics

### Must-Know for Technical Rounds
1. **DSA**: Arrays, strings, linked lists, trees, graphs, DP (minimum 200 problems)
2. **DBMS & SQL**: Complex queries, joins, indexing, normalization
3. **OOP Concepts**: Solid examples in Java/C++/Python
4. **OS Basics**: Deadlocks, memory management, process scheduling
5. **Computer Networks**: TCP/IP, HTTP, DNS basics

### Aptitude & Reasoning
- Quantitative aptitude
- Logical reasoning
- Verbal ability
- Data interpretation

### Service vs Product Company Focus
- **Service Companies (TCS, Infosys, Wipro)**: CGPA ≥ 7, basic coding, communication, aptitude
- **Product Companies (Amazon, Google, Microsoft)**: Strong DSA, system design basics, problem-solving

## Common Academic Mistakes

### First Year
- Ignoring fundamentals assuming they're easy
- Not building coding habit early
- Focusing only on theory, neglecting practicals

### Second Year
- Random certifications without depth
- Not starting DSA practice
- Ignoring DBMS and SQL

### Third Year
- Delaying internship applications
- Poor project selection
- Not building a portfolio/GitHub presence

### Final Year
- Last-minute placement preparation
- Weak communication in interviews
- Not practicing mock interviews

## Skills Recommended by Seniors

### Technical Skills
- Python/Java proficiency
- SQL and database design
- Git and version control
- Basic cloud deployment
- API development basics

### Soft Skills
- Clear communication
- Problem-solving approach articulation
- Team collaboration
- Time management

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

const SYSTEM_PROMPT = `You are an intelligent academic assistant for CSBS (Computer Science and Business Systems) students. Your knowledge is STRICTLY grounded in the provided syllabus and senior academic experiences.

CRITICAL RULES:
1. ONLY answer questions that are covered in the syllabus knowledge base provided
2. If a question is NOT related to the CSBS curriculum, academics, exams, placements, or career guidance, respond with: "⚠️ This topic is not covered in the syllabus. I can only help with CSBS curriculum, exam preparation, placements, and academic guidance."
3. NEVER make up or hallucinate information
4. Always be helpful, concise, and student-friendly
5. Use bullet points and clear formatting for readability
6. Reference specific subjects, semesters, or topics when relevant
7. For exam-related questions, provide actionable study tips
8. For placement questions, give realistic, senior-validated advice

KNOWLEDGE BASE:
${SYLLABUS_KNOWLEDGE}

RESPONSE STYLE:
- Be concise but comprehensive
- Use emojis sparingly for clarity (📚, ✅, ⚠️, 💡)
- Provide actionable advice when possible
- Acknowledge limitations honestly
- Format with bullet points for readability`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing syllabus chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
