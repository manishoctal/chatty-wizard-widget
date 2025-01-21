import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
        <p className="text-lg text-muted-foreground">
          How can we help you today?
        </p>
      </div>
      <ChatBot />
    </div>
  );
};

export default Index;