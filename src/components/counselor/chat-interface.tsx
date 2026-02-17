'use client';

import { useState, useRef, useEffect, useMemo, type FormEvent } from 'react';
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
    await addDocumentNonBlocking(messagesCollectionRef, { ...userMessage, timestamp: serverTimestamp() });

    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const result = await personalCounselor({
        history: history,
        message: input,
      });
      const modelMessage: Omit<ChatMessage, 'id' | 'timestamp'> = { role: 'model', content: result.response, userProfileId: user.uid };
      await addDocumentNonBlocking(messagesCollectionRef, { ...modelMessage, timestamp: serverTimestamp() });
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

  const sortedMessages = useMemo(() => {
    return (messages || []).slice().sort((a, b) => {
      const timeA = a.timestamp?.toMillis() || 0;
      const timeB = b.timestamp?.toMillis() || 0;
      return timeA - timeB;
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-black relative">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-black to-black pointer-events-none"></div>

      <ScrollArea className="flex-1 p-4 z-10" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto space-y-6 py-4">
          {sortedMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={cn(
                'flex items-end gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  'px-5 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-primary to-emerald-600 text-black font-medium rounded-br-none'
                    : 'bg-white/10 border border-white/10 text-gray-200 backdrop-blur-md rounded-bl-none'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="px-5 py-3 rounded-2xl rounded-bl-none bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
                <span className="text-xs text-gray-400">Thinking</span>
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1.5 pl-4 backdrop-blur-xl shadow-2xl">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
              disabled={isLoading || !user}
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-primary text-black hover:bg-primary/90 h-10 w-10 shrink-0 transition-transform active:scale-95"
              disabled={isLoading || !input.trim() || !user}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-gray-600 mt-2">
            AI Counselor can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
