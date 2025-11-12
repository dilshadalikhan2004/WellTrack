
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, getDoc, query, orderBy, getCountFromServer } from 'firebase/firestore';
import type { CommunityForumDoc, ForumPost, UserProfile } from '@/lib/types';
import { useEffect, useState } from 'react';
import { EditPostDialog } from './edit-post-dialog';
import Link from 'next/link';

export function LatestPosts({ forums }: { forums: CommunityForumDoc[] }) {
  const firestore = useFirestore();
  const { user } = useUser();

  const postsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, `forum_posts`),
      orderBy('timestamp', 'desc')
    );
  }, [firestore]);


  const { data: posts, isLoading: postsLoading } =
    useCollection<ForumPost>(postsCollectionRef);

  const [postsWithAuthors, setPostsWithAuthors] = useState<ForumPost[]>([]);

  useEffect(() => {
    if (posts && firestore) {
      const fetchAuthorsAndReplies = async () => {
        const postsWithData = await Promise.all(
          posts.map(async (post) => {
            const userProfileRef = doc(
              firestore,
              `users/${post.userProfileId}/user_profile`,
              post.userProfileId
            );
            const repliesColRef = collection(firestore, `forum_posts/${post.id}/replies`);

            try {
              const [userDoc, repliesSnapshot] = await Promise.all([
                  getDoc(userProfileRef),
                  getCountFromServer(repliesColRef)
              ]);

              const authorName = userDoc.exists()
                ? (userDoc.data() as UserProfile).username
                : 'Anonymous';
              
              const repliesCount = repliesSnapshot.data().count;

              return { ...post, author: { name: authorName }, replies: repliesCount };
            } catch (e) {
              return { ...post, author: { name: 'Anonymous' }, replies: 0 };
            }
          })
        );
        setPostsWithAuthors(postsWithData);
      };
      fetchAuthorsAndReplies();
    }
  }, [posts, firestore]);

  const isLoading = postsLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Latest Posts</CardTitle>
          <CardDescription>
            Recent discussions from the community.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && <p>Loading posts...</p>}
        {!isLoading &&
          postsWithAuthors.map((post) => {
            const forum = forums?.find((f) => f.id === post.communityForumId);
            const isAuthor = user?.uid === post.userProfileId;
            return (
              <div
                key={post.id}
                className="flex items-start gap-4 p-4 transition-colors border rounded-lg hover:bg-accent/50"
              >
                <Avatar>
                  <AvatarFallback>
                    {post.author?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.author?.name || 'Anonymous'}</span>
                      <span>&middot;</span>
                      <span>
                        {post.timestamp ? formatDistanceToNow(post.timestamp.toDate(), {
                          addSuffix: true,
                        }) : 'Just now'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {forum && <Badge variant="secondary">{forum.name}</Badge>}
                        {isAuthor && (
                            <EditPostDialog post={post} />
                        )}
                    </div>
                  </div>
                  <Link href={`/community/${post.id}`} passHref>
                    <h4 className="font-semibold text-lg hover:underline cursor-pointer">
                        {post.title}
                    </h4>
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies || 0} replies</span>
                  </div>
                </div>
              </div>
            );
          })}
        {!isLoading && (!posts || posts.length === 0) && (
          <div className="py-12 text-center text-muted-foreground">
            Be the first to start a discussion!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
