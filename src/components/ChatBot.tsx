import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send, Minus, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
}

// Function to convert markdown-style links to HTML
const convertLinksToHTML = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
};

// Function to generate a new session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      content: "👋 Hi there! I'm your AI assistant. How can I help you today?",
      sender: "bot",
    },
    {
      id: "welcome-2",
      content: "Feel free to ask me anything about our services, products, or any other questions you might have!",
      sender: "bot",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('https://octal-chat-bot.octallabs.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: userMessage.content,
          session_id: sessionId 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the chatbot. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRestartChat = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setMessages([
      {
        id: "welcome-1",
        content: "👋 Hi there! I'm your AI assistant. How can I help you today?",
        sender: "bot",
      },
      {
        id: "welcome-2",
        content: "Feel free to ask me anything about our services, products, or any other questions you might have!",
        sender: "bot",
      }
    ]);
    toast({
      title: "Chat Restarted",
      description: "A new chat session has been started.",
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg animate-fade-in"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 w-96 shadow-lg transition-all duration-300 animate-fade-in",
      isMinimized ? "h-14" : "h-[600px]"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Chat Support</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRestartChat}
            title="Restart Chat"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(600px-8rem)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 animate-fade-in",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: convertLinksToHTML(message.content)
                  }}
                />
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2 animate-fade-in">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-foreground/50 animate-typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-foreground/50 animate-typing-dot [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-foreground/50 animate-typing-dot [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};