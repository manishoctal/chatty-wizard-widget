import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
        body: JSON.stringify({ query: userMessage.content }),
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
                >
                  {message.content}
                </div>
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