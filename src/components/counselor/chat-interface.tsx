'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { personalCounselor } from '@/ai/flows/personal-counselor-flow';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { ChatMessage } from '@/lib/types';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  const { user } = useUser();
  const firestore = useFirestore();

  const messagesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/counselor_chats`);
  }, [firestore, user]);

  const { data: messages } = useCollection<ChatMessage>(messagesCollectionRef);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !messagesCollectionRef || !user || !messages) return;

    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = { role: 'user', content: input, userProfileId: user.uid };
    await addDocumentNonBlocking(messagesCollectionRef, {...userMessage, timestamp: serverTimestamp()});

    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({role: m.role, content: m.content}));
      const result = await personalCounselor({
        history: history,
        message: input,
      });
      const modelMessage: Omit<ChatMessage, 'id' | 'timestamp'> = { role: 'model', content: result.response, userProfileId: user.uid };
      await addDocumentNonBlocking(messagesCollectionRef, {...modelMessage, timestamp: serverTimestamp()});
    } catch (error) {
      console.error('Error with AI Counselor:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'The AI counselor is currently unavailable. Please try again later.',
      });
       // Here you might want to add an error message to the chat UI
    } finally {
      setIsLoading(false);
    }
  };
  
  const sortedMessages = (messages || []).slice().sort((a, b) => {
    const timeA = a.timestamp?.toMillis() || 0;
    const timeB = b.timestamp?.toMillis() || 0;
    return timeA - timeB;
  });

  return (
    <div className="flex flex-col h-full bg-muted/40">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          {sortedMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={cn(
                'flex items-start gap-4',
                message.role === 'user' ? 'justify-end' : ''
              )}
            >
              {message.role === 'model' && (
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>
                    <Bot className="w-5 h-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'p-4 rounded-xl max-w-[80%] whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background'
                )}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-10 h-10 border">
                   <AvatarImage src={user?.photoURL || userAvatar?.imageUrl} alt={user?.displayName || 'User'} data-ai-hint={userAvatar?.imageHint}/>
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarFallback>
                  <Bot className="w-5 h-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="p-4 rounded-xl bg-background">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSubmit} className="flex items-center max-w-3xl mx-auto gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading || !user}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading || !input.trim() || !user}>
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
