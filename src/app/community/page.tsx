
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ForumList } from '@/components/community/forum-list';
import { LatestPosts } from '@/components/community/latest-posts';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CommunityForumDoc } from '@/lib/types';

export default function CommunityPage() {
    const firestore = useFirestore();
    const forumsCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, `community_forums`);
    }, [firestore]);

    const { data: forums, isLoading: forumsLoading } = useCollection<CommunityForumDoc>(forumsCollectionRef);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 hidden h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 md:flex md:items-center">
                <h1 className="text-xl font-semibold">
                    Community Forums
                </h1>
            </header>
            <main className="flex-1 p-4 space-y-6 bg-muted/40 md:p-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Welcome to the Community</CardTitle>
                        <CardDescription>
                            A safe and anonymous space to connect with fellow students, share experiences, and find support.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <LatestPosts forums={forums || []} forumsLoading={forumsLoading}/>
                    </div>
                    <div className="lg:col-span-1">
                        <ForumList forums={forums || []} isLoading={forumsLoading} />
                    </div>
                </div>
            </main>
        </div>
    );
}
