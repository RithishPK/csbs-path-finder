import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface QAPair {
  keywords: string[];
  question: string;
  answer: string;
}

const knowledgeBase: QAPair[] = [
  // Degree Value & Difficulty
  {
    keywords: ['degree', 'valued', 'companies', 'fancy', 'name', 'worth'],
    question: "Is my degree actually valued by companies or is it just a fancy name?",
    answer: "It's valued if you have skills. Companies don't reject CSBS; they reject weak profiles."
  },
  {
    keywords: ['difficult', 'cse', 'ise', 'compare', 'harder', 'easier'],
    question: "How difficult is this program compared to CSE/ISE?",
    answer: "Slightly lighter than CSE, similar pressure during placements. Less theory, more mix."
  },
  {
    keywords: ['meant', 'for me', 'right', 'fit'],
    question: "Is this degree even meant for me?",
    answer: "Yes, if you adapt. No degree carries anyone automatically."
  },
  {
    keywords: ['wrong', 'program', 'choice', 'mistake', 'branch'],
    question: "Did I choose the wrong program?",
    answer: "Wrong mindset matters more than wrong branch."
  },

  // CGPA Reality Checks
  {
    keywords: ['subjects', 'matter', 'placements', 'exams', 'important'],
    question: "Which subjects actually matter for placements and which are just for exams?",
    answer: "Matter: DSA, DBMS, OS, SQL, ML basics.\nExams only: Some management and theory-heavy subjects."
  },
  {
    keywords: ['high', 'cgpa', 'realistic', 'maintain', 'possible'],
    question: "Is maintaining a high CGPA realistic in this program?",
    answer: "Yes, if you're consistent. CSBS is not a GPA-killer by default."
  },
  {
    keywords: ['cgpa', 'drops', 'below', '7', 'finished', 'done', 'over'],
    question: "If my CGPA drops below 7 / 7.5, am I finished?",
    answer: "No. It limits options but doesn't end them."
  },
  {
    keywords: ['cgpa', 'seniors', 'good', 'placements', 'had'],
    question: "What CGPA did seniors with good placements actually have?",
    answer: "Mostly between 7.2–8.5. Skills mattered more than decimals."
  },
  {
    keywords: ['cgpa', 'skills', 'focus', 'both', 'manage', 'priority'],
    question: "Is it better to focus on CGPA or skills if I can't manage both?",
    answer: "Skills first. Keep CGPA above 7 if possible."
  },

  // Study & Mistakes
  {
    keywords: ['toppers', 'study', 'skip', 'how'],
    question: "How do toppers really study—what do they skip?",
    answer: "Past papers, internals patterns. They skip unnecessary depth."
  },
  {
    keywords: ['mistakes', 'juniors', '1st', '2nd', 'year', 'first', 'second'],
    question: "What mistakes do most juniors make in 1st–2nd year?",
    answer: "Ignoring DSA, random certifications, chasing CGPA blindly."
  },
  {
    keywords: ['subjects', 'pull', 'down', 'cgpa', 'tough', 'hard'],
    question: "What subjects usually pull CGPA down?",
    answer: "Statistics, finance-heavy courses, math-linked analytics papers."
  },
  {
    keywords: ['self-learning', 'self', 'learning', 'beyond', 'classes', 'hours'],
    question: "How much self-learning is mandatory beyond classes?",
    answer: "At least 1–2 focused hours daily."
  },

  // Placements & Careers
  {
    keywords: ['roles', 'get', 'realistically', 'job', 'position'],
    question: "What roles can I realistically get with this degree?",
    answer: "Software Engineer, Analyst, Data/Business Analyst, Associate Consultant."
  },
  {
    keywords: ['eligible', 'core', 'tech', 'analyst', 'developer'],
    question: "Are we eligible for core tech roles or only analyst roles?",
    answer: "Eligible for both. Core tech needs strong coding proof."
  },
  {
    keywords: ['companies', 'hired', 'seniors', 'which', 'recruit'],
    question: "Which companies hired seniors from this program?",
    answer: "Service companies, mid-size tech firms, a few product startups."
  },
  {
    keywords: ['startups', 'service', 'value', 'prefer'],
    question: "Do startups value this degree more than service companies?",
    answer: "Yes. Skills matter more than branch name in startups."
  },

  // Internships, Skills & Certifications
  {
    keywords: ['internship', 'start', 'prep', 'when', 'apply'],
    question: "When should I seriously start internship prep?",
    answer: "Basics in 2nd year. Apply aggressively in 3rd year."
  },
  {
    keywords: ['skills', 'certificates', 'matter', 'important'],
    question: "What skills mattered more than certificates?",
    answer: "DSA, SQL, projects, communication, interview clarity."
  },
  {
    keywords: ['certifications', 'useful', 'fillers', 'worth', 'certificate'],
    question: "Which certifications are useful vs fillers?",
    answer: "Useful: Cloud basics, data analytics, ML fundamentals.\nFillers: Random beginner AI/finance courses."
  },
  {
    keywords: ['many', 'certifications', 'too', 'how many'],
    question: "How many certifications is too many?",
    answer: "More than 5 with no projects looks fake."
  },
  {
    keywords: ['certifications', 'regret', 'waste', 'useless'],
    question: "What certifications did seniors regret?",
    answer: 'Generic "AI for beginners" and non-technical management courses.'
  },

  // Strategy & Mindset
  {
    keywords: ['follow', 'everyone', 'own', 'path', 'crowd'],
    question: "Should I follow everyone or carve my own path?",
    answer: "Follow basics first, customize later. Don't be random."
  },
  {
    keywords: ['low', 'cgpa', 'product', 'companies', 'want'],
    question: "If my CGPA is low but I want product companies, what should I do?",
    answer: "Strong projects, DSA mastery, off-campus applications."
  },
  {
    keywords: ['service', 'companies', 'safest', 'path', 'target'],
    question: "If I target service companies, what's the safest path?",
    answer: "CGPA ≥ 7, basic coding, communication, aptitude prep."
  },
  {
    keywords: ['hackathons', 'worth', 'winning', 'participate'],
    question: "Is doing hackathons worth it if I'm not winning?",
    answer: "Yes if you learn. No if you just attend."
  },
  {
    keywords: ['delay', 'skill', '3rd', 'year', 'late', 'postpone'],
    question: "What happens if I delay skill-building till 3rd year?",
    answer: "You'll panic in final year. Recovery is possible but stressful."
  },

  // Emotional Reality Checks
  {
    keywords: ['everyone', 'better', 'lagging', 'behind', 'compare'],
    question: "Everyone seems better than me—am I lagging?",
    answer: "No. You're seeing highlights, not struggles."
  },
  {
    keywords: ['effort', 'results', 'wrong', 'show', 'trying'],
    question: "I put effort but results don't show—what's wrong?",
    answer: "Unfocused effort or wrong priorities."
  },
  {
    keywords: ['recover', 'bad', 'semester', 'bounce', 'back'],
    question: "How did seniors recover after a bad semester?",
    answer: "Fixed basics, stopped comparing, focused on one clear goal."
  }
];

const WELCOME_MESSAGE = "👋 Hi! I'm your Senior Mentor Bot. Ask me honest questions about CSBS, placements, CGPA, and mistakes seniors made.\n\n⚠️ Prototype mentor bot based on senior experiences.";
const FALLBACK_RESPONSE = "This prototype currently answers common CSBS doubts based on senior experiences. Try asking about CGPA, placements, skills, certifications, or common mistakes.";

const findBestMatch = (userInput: string): string => {
  const input = userInput.toLowerCase().trim();
  
  if (input.length < 3) {
    return FALLBACK_RESPONSE;
  }

  let bestMatch: QAPair | null = null;
  let maxScore = 0;

  for (const qa of knowledgeBase) {
    let score = 0;
    
    // Check keyword matches
    for (const keyword of qa.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }
    
    // Check partial sentence matching
    const questionWords = qa.question.toLowerCase().split(/\s+/);
    const inputWords = input.split(/\s+/);
    
    for (const inputWord of inputWords) {
      if (inputWord.length > 2) {
        for (const qWord of questionWords) {
          if (qWord.includes(inputWord) || inputWord.includes(qWord)) {
            score += 1;
          }
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = qa;
    }
  }

  // Require minimum score threshold
  if (maxScore >= 2 && bestMatch) {
    return `📌 ${bestMatch.answer}`;
  }

  return FALLBACK_RESPONSE;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: WELCOME_MESSAGE, sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot thinking delay
    setTimeout(() => {
      const botResponse = findBestMatch(inputValue);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Senior Mentor Bot</h3>
              <p className="text-xs text-primary-foreground/80">Prototype • Based on experiences</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-[320px] overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card border border-border text-card-foreground rounded-bl-md shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about CSBS, placements..."
                className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="shrink-0"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              ⚠️ Simulated responses • Not AI predictions
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
