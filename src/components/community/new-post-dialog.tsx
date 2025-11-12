
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { PlusCircle, Loader2, Sparkles } from 'lucide-react';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { CommunityForumDoc } from '@/lib/types';
import { categorizePost } from '@/ai/flows/categorize-post-flow';


export function NewPostDialog({ forums, isLoading }: { forums: CommunityForumDoc[], isLoading: boolean }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!title || !content || !user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out a title and message for your post.',
      });
      setIsSubmitting(false);
      return;
    }

    if (!forums || forums.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Forums not available',
            description: 'Cannot categorize post because forums are not loaded. Please try again in a moment.',
        });
        setIsSubmitting(false);
        return;
    }
    
    try {
        const { forumId } = await categorizePost({
            postTitle: title,
            postContent: content,
            availableForums: forums.map(f => ({ id: f.id, name: f.name, description: f.description })),
        });
        
        const postsCollection = collection(firestore, 'forum_posts');
        
        await addDocumentNonBlocking(postsCollection, {
            title,
            content,
            communityForumId: forumId,
            userProfileId: user.uid,
            timestamp: serverTimestamp(),
            replies: 0,
        });
        
        toast({
          title: 'Post Created!',
          description: 'Your discussion has been automatically categorized and started.',
        });

        resetForm();
        setOpen(false);
    } catch (error) {
        console.error("AI categorization or post creation failed:", error);
        toast({
            variant: 'destructive',
            title: 'Error Creating Post',
            description: 'There was a problem submitting your post. Please try again.'
        })
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button disabled={!user || isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4 mr-2" />
          )}
          Start a Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts and the AI will automatically place it in the best forum for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A clear and concise title" 
                required 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">Your Message</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share your experience, ask a question, or offer support."
                required
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                )}
                Categorize & Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    