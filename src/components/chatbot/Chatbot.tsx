
'use client';

import { useState, useEffect }  from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { handleChatbotQuery } from '../../../app/actions/chatActions'; // Corrected relative import path
import { AetherLogo } from '@/components/ui/AetherLogo';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now().toString(), text, sender, timestamp: new Date() },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    addMessage(userMessage, 'user');
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponse = await handleChatbotQuery({ query: userMessage });
      addMessage(botResponse.response, 'bot');
    } catch (error) {
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      console.error('Chatbot error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isMounted) {
    return null; 
  }

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-md">
          <Card className="shadow-2xl border-accent">
            <CardHeader className="flex flex-row items-center justify-between bg-accent text-accent-foreground p-4 rounded-t-lg">
              <div className="flex items-center gap-2">
                <AetherLogo className="h-6 w-6 stroke-accent-foreground fill-accent-foreground" />
                <CardTitle className="text-lg font-headline">Aether Support</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-accent-foreground hover:bg-accent/80">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96 p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      msg.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {msg.text}
                    </div>
                     {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                      </Avatar>
                    <div className="rounded-lg px-3 py-2 bg-muted text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
