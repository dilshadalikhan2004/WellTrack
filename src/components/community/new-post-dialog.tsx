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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { PlusCircle } from 'lucide-react';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { CommunityForumDoc } from '@/lib/types';


export function NewPostDialog({ forums }: { forums: CommunityForumDoc[] }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [forumId, setForumId] = useState('');

  const resetForm = () => {
    setTitle('');
    setContent('');
    setForumId('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !content || !user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out a title and message for your post.',
      });
      return;
    }
    
    let finalForumId = forumId;
    if (!finalForumId) {
        // Correctly look for the default forum or use a fallback.
        const generalForum = forums.find(f => f.name === 'General Wellness') || forums[0];
        if (generalForum) {
            finalForumId = generalForum.id;
        } else {
             toast({
                variant: 'destructive',
                title: 'No Forums Available',
                description: 'Cannot create a post because no forums exist.',
            });
            return;
        }
    }

    const postsCollection = collection(firestore, 'forum_posts');
    
    await addDocumentNonBlocking(postsCollection, {
        title,
        content,
        communityForumId: finalForumId,
        userProfileId: user.uid,
        timestamp: serverTimestamp(),
        replies: 0,
    });
    
    toast({
      title: 'Post Created!',
      description: 'Your discussion has been started.',
    });

    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button disabled={!user}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Start a Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community. Your post will be anonymous.
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
              <Label htmlFor="forum">Forum (Optional)</Label>
              <Select 
                value={forumId}
                onValueChange={setForumId}
              >
                <SelectTrigger id="forum">
                  <SelectValue placeholder="Defaults to General Wellness" />
                </SelectTrigger>
                <SelectContent>
                  {forums && forums.map(forum => (
                    <SelectItem key={forum.id} value={forum.id}>{forum.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit">Create Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
