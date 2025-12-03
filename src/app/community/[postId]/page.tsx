
'use client';

import { useParams } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { ForumPost, ForumPostReply, UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function PostSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/2 h-4 mt-2 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
                 <div className="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
        </Card>
    )
}

function ReplySkeleton() {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
                <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    )
}


export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [postAuthor, setPostAuthor] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch the post document
  const postDocRef = useMemoFirebase(() => {
    if (!firestore || !postId) return null;
    return doc(firestore, 'forum_posts', postId);
  }, [firestore, postId]);
  const { data: post, isLoading: isPostLoading } = useDoc<ForumPost>(postDocRef);

  // Fetch replies subcollection
  const repliesColRef = useMemoFirebase(() => {
    if (!firestore || !postId) return null;
    return query(collection(firestore, 'forum_posts', postId, 'replies'), orderBy('timestamp', 'asc'));
  }, [firestore, postId]);
  const { data: replies, isLoading: areRepliesLoading } = useCollection<ForumPostReply>(repliesColRef);

  // Fetch post author's name
  useEffect(() => {
    if (post && firestore && !postAuthor) {
      const fetchAuthor = async () => {
        const userProfileRef = doc(firestore, `users/${post.userProfileId}/user_profile`, post.userProfileId);
        try {
          const userDoc = await doc(firestore, 'users', post.userProfileId, 'user_profile', post.userProfileId).get();
          const authorName = userDoc.exists() ? (userDoc.data() as UserProfile).username : 'Anonymous';
          setPostAuthor(authorName);
        } catch (e) {
          setPostAuthor('Anonymous');
        }
      };
      fetchAuthor();
    }
  }, [post, firestore, postAuthor]);


  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !user || !repliesColRef) return;
    
    setIsSubmitting(true);
    const replyData = {
        postId: postId,
        userProfileId: user.uid,
        content: replyContent,
        timestamp: serverTimestamp(),
    };

    await addDocumentNonBlocking(repliesColRef.parent.collection('replies'), replyData);
    
    toast({ title: 'Reply Posted!' });
    setReplyContent('');
    setIsSubmitting(false);
  };
  
    const [repliesWithAuthors, setRepliesWithAuthors] = useState<ForumPostReply[]>([]);

    useEffect(() => {
        if (replies && firestore) {
            const fetchAuthors = async () => {
                const repliesWithData = await Promise.all(
                    replies.map(async (reply) => {
                         const userProfileRef = doc(
                            firestore,
                            `users/${reply.userProfileId}/user_profile`,
                            reply.userProfileId
                        );
                        try {
                            const userDoc = await getDoc(userProfileRef);
                            const authorName = userDoc.exists()
                                ? (userDoc.data() as UserProfile).username
                                : 'Anonymous';
                            return { ...reply, author: { name: authorName } };
                        } catch (e) {
                            return { ...reply, author: { name: 'Anonymous' } };
                        }
                    })
                );
                setRepliesWithAuthors(repliesWithData);
            };
            fetchAuthors();
        }
    }, [replies, firestore]);

  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
           <Button variant="ghost" size="icon" asChild>
                <Link href="/community">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
            </Button>
           <h1 className="text-xl font-semibold truncate">
                Discussion
           </h1>
      </header>
      <main className="flex-1 p-4 space-y-6 bg-muted/40 md:p-8">
        {isPostLoading && <PostSkeleton />}
        {post && (
             <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <CardDescription>
                       Posted by {postAuthor || '...'} on {post.timestamp ? format(post.timestamp.toDate(), 'MMMM d, yyyy') : '...'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-base whitespace-pre-wrap">
                    {post.content}
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                <CardTitle>Replies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {areRepliesLoading && <ReplySkeleton />}
                {repliesWithAuthors.map(reply => (
                    <div key={reply.id} className="flex items-start gap-4">
                        <Avatar className='mt-1'>
                            <AvatarFallback>{reply.author?.name?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 p-4 border rounded-lg bg-background">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">{reply.author?.name || 'Anonymous'}</span>
                                <span className="text-xs text-muted-foreground">
                                    {reply.timestamp ? formatDistanceToNow(reply.timestamp.toDate(), { addSuffix: true }) : 'Just now'}
                                </span>
                            </div>
                            <p className="mt-2 text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                    </div>
                ))}
                {!areRepliesLoading && repliesWithAuthors.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground">No replies yet. Be the first to respond!</p>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Join the Discussion</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleReplySubmit} className="flex flex-col gap-4">
                    <Textarea 
                        placeholder={user ? "Write your reply..." : "Please log in to reply."}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        disabled={!user || isSubmitting}
                        className='min-h-[120px]'
                    />
                    <Button type="submit" className="self-end" disabled={!user || isSubmitting || !replyContent.trim()}>
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Send className="w-4 h-4 mr-2" />
                        Post Reply
                    </Button>
                </form>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
