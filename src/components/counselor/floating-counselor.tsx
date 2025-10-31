'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Bot, MessageCircle, X } from 'lucide-react';
import { ChatInterface } from './chat-interface';
import { cn } from '@/lib/utils';

export function FloatingCounselor() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6" /> AI Personal Counselor
            </DialogTitle>
            <DialogDescription>
              A safe space to talk about what's on your mind.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Counselor"
        >
          <div className={cn("absolute transition-all duration-300 ease-in-out", isOpen ? "rotate-90 scale-0" : "rotate-0 scale-100")}>
            <MessageCircle className="w-8 h-8" />
          </div>
           <div className={cn("absolute transition-all duration-300 ease-in-out", isOpen ? "rotate-0 scale-100" : "-rotate-90 scale-0")}>
            <X className="w-8 h-8" />
          </div>
        </Button>
      </div>
    </>
  );
}
