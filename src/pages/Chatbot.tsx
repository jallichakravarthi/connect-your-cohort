import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, User, HelpCircle } from "lucide-react";
import { chatbot } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Chatbot = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
    setConversation([
      { type: 'bot', message: 'Hello! I\'m here to help you with CampusConnect. You can ask me about connecting with alumni, mentorship, or forum participation.' }
    ]);
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await chatbot.getQuestions();
      setQuestions(Array.from(data) || []);
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast({
        title: "Error",
        description: "Failed to load chatbot questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = async (question: string) => {
    // Add user question to conversation
    setConversation(prev => [...prev, { type: 'user', message: question }]);

    try {
      const response = await chatbot.ask(question);
      // Add bot response to conversation
      setConversation(prev => [...prev, { type: 'bot', message: response }]);
    } catch (error) {
      console.error('Failed to get response:', error);
      setConversation(prev => [...prev, { 
        type: 'bot', 
        message: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">CampusConnect Assistant</h1>
        <p className="text-muted-foreground">Get quick answers to common questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Area */}
        <div className="lg:col-span-2">
          <Card className="shadow-elegant h-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80 overflow-y-auto space-y-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Questions */}
        <div>
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Quick Questions
              </CardTitle>
              <CardDescription>Click on any question to get help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 whitespace-normal"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{question}</span>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No questions available</p>
              )}
            </CardContent>
          </Card>

          {/* Help Topics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Common Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary" className="mr-2 mb-2">Alumni Search</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Mentorship</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Forum Usage</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Profile Setup</Badge>
              <Badge variant="secondary" className="mr-2 mb-2">Connections</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;