import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, BookOpen, Sparkles, Loader2, Upload, FileText, Trash2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface UploadedPDF {
  name: string;
  content: string;
  url: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/syllabus-chat`;

const WELCOME_MESSAGE = `👋 Welcome to **Syllabus AI Assistant**!

I'm your academic guide powered by AI, with knowledge grounded in:
- 📚 Official CSBS curriculum & syllabus
- 🎓 First-batch senior experiences
- 📝 Exam patterns & preparation tips
- 💼 Placement guidance

**📄 NEW: Upload your own syllabus PDFs for custom grounding!**

**Ask me about:**
• Subject details & what to study
• Exam preparation strategies
• Placement-relevant topics
• Career paths after CSBS

⚠️ *All responses are strictly based on syllabus content. I'll tell you if something isn't covered.*`;

const QUICK_PROMPTS = [
  "What are the most important subjects for placements?",
  "How should I prepare for DSA?",
  "What's the exam pattern for DBMS?",
  "Which semester is the hardest?",
  "Give me semester 3 subjects list along with their credits",
  "What are the program electives in semester 5?",
];

const SyllabusAISection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: WELCOME_MESSAGE,
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPDFs, setUploadedPDFs] = useState<UploadedPDF[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let text = '';
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const rawText = decoder.decode(uint8Array);
    
    const textMatches = rawText.match(/\(([^)]+)\)/g);
    if (textMatches) {
      text = textMatches
        .map(match => match.slice(1, -1))
        .filter(t => t.length > 2 && /[a-zA-Z]/.test(t))
        .join(' ');
    }
    
    const plainTextSections = rawText.match(/BT[\s\S]*?ET/g);
    if (plainTextSections) {
      for (const section of plainTextSections) {
        const sectionMatches = section.match(/\(([^)]+)\)/g);
        if (sectionMatches) {
          text += ' ' + sectionMatches
            .map(match => match.slice(1, -1))
            .filter(t => t.length > 2 && /[a-zA-Z]/.test(t))
            .join(' ');
        }
      }
    }

    text = text
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length < 100) {
      text = `[PDF Document: ${file.name}] - Note: Limited text extraction available. The AI will use any available content for context.`;
    }

    return text;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (file.type !== 'application/pdf') {
          toast({
            title: 'Invalid file type',
            description: 'Please upload only PDF files',
            variant: 'destructive',
          });
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: 'Maximum file size is 10MB',
            variant: 'destructive',
          });
          continue;
        }

        const extractedText = await extractTextFromPDF(file);

        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('syllabus-pdfs')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: 'Upload failed',
            description: uploadError.message,
            variant: 'destructive',
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('syllabus-pdfs')
          .getPublicUrl(fileName);

        setUploadedPDFs(prev => [...prev, {
          name: file.name,
          content: extractedText,
          url: publicUrl,
        }]);

        toast({
          title: 'PDF uploaded successfully',
          description: `${file.name} is now part of the knowledge base`,
        });
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: 'Upload error',
        description: 'Failed to process the PDF file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePDF = (index: number) => {
    setUploadedPDFs(prev => prev.filter((_, i) => i !== index));
    toast({
      title: 'PDF removed',
      description: 'The document has been removed from the knowledge base',
    });
  };

  const getCustomSyllabusContent = () => {
    if (uploadedPDFs.length === 0) return undefined;
    return uploadedPDFs.map(pdf => `### ${pdf.name}\n${pdf.content}`).join('\n\n');
  };

  const streamChat = async (userMessages: { role: string; content: string }[]) => {
    const customContent = getCustomSyllabusContent();
    
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages,
        customSyllabusContent: customContent,
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${resp.status}`);
    }

    if (!resp.body) {
      throw new Error('No response body');
    }

    return resp;
  };

  const handleSend = async (customMessage?: string) => {
    const messageText = customMessage || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageText,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const apiMessages = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }));
    apiMessages.push({ role: 'user', content: messageText });

    try {
      const response = await streamChat(apiMessages);
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      let assistantContent = '';
      const assistantId = `assistant-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          content: '',
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);

      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response',
        variant: 'destructive',
      });
      setMessages((prev) => prev.filter((m) => m.content !== ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return `<li key="${i}" class="ml-4">${line.slice(2)}</li>`;
        }
        return `<p key="${i}" class="mb-1">${line}</p>`;
      })
      .join('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
          Syllabus AI Assistant
          <Sparkles className="w-6 h-6 text-primary" />
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your intelligent academic companion powered by AI. Get accurate answers grounded in official VTU 2022 CSBS curriculum, exam patterns, and placement guidance.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-sm text-primary">
          <BookOpen className="w-4 h-4" />
          <span>Responses grounded in official syllabus content</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        {/* Upload Section Toggle */}
        <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Academic Chat</h3>
              <p className="text-xs text-primary-foreground/70">
                Powered by Gemini • VTU 2022 Scheme
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/20 gap-2"
            onClick={() => setShowUploadSection(!showUploadSection)}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload PDF</span>
          </Button>
        </div>

        {/* Upload Section */}
        {showUploadSection && (
          <div className="px-6 py-4 bg-secondary/50 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">📄 Custom Syllabus PDFs</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-8"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Add PDF
                  </>
                )}
              </Button>
            </div>
            
            {uploadedPDFs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No PDFs uploaded. Add your syllabus documents for custom AI grounding.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {uploadedPDFs.map((pdf, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-card rounded-lg px-3 py-2 text-sm border border-border"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{pdf.name}</span>
                    </div>
                    <button
                      onClick={() => removePDF(index)}
                      className="p-1.5 hover:bg-destructive/10 rounded text-destructive shrink-0"
                      title="Remove PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {uploadedPDFs.length > 0 && (
              <p className="text-xs text-muted-foreground mt-3">
                ✅ AI will use these documents for context-aware responses
              </p>
            )}
          </div>
        )}

        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-secondary/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border text-card-foreground rounded-bl-md shadow-sm'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div
                    className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                ) : (
                  message.content
                )}
                {message.role === 'assistant' && message.content === '' && isLoading && (
                  <div className="flex items-center gap-2 text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-6 py-4 flex flex-wrap gap-2 bg-card border-t border-border">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-sm px-4 py-2 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors border border-border disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about syllabus, exams, placements, semester subjects..."
              className="flex-1 min-h-[52px] max-h-40 resize-none bg-secondary/50 border-border focus-visible:ring-primary rounded-xl"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              size="icon"
              className="shrink-0 h-12 w-12 rounded-xl"
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            📚 Responses grounded in official VTU 2022 syllabus{uploadedPDFs.length > 0 ? ` + ${uploadedPDFs.length} uploaded PDF${uploadedPDFs.length > 1 ? 's' : ''}` : ''} • No hallucinations
          </p>
        </div>
      </div>
    </div>
  );
};

export default SyllabusAISection;
