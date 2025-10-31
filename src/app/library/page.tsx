
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookHeart, Info, Video, Mic, BookOpen } from 'lucide-react';
import { ResourceCard } from '@/components/library/resource-card';
import type { Resource } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - in a real app, this would come from Firestore
const mockResources: Resource[] = [
    {
        id: 'info-1',
        title: 'Understanding Anxiety',
        description: 'A visual guide to the symptoms and science of anxiety.',
        type: 'infographic',
        category: 'Anxiety',
        imageUrl: 'https://picsum.photos/seed/infographic1/600/400',
        duration: 5,
    },
    {
        id: 'info-2',
        title: 'The CBT Triangle',
        description: 'Learn how thoughts, feelings, and behaviors are connected.',
        type: 'infographic',
        category: 'CBT',
        imageUrl: 'https://picsum.photos/seed/infographic2/600/400',
        duration: 3,
    },
    {
        id: 'info-3',
        title: '5 Grounding Techniques',
        description: 'Simple exercises to stay present during moments of panic.',
        type: 'infographic',
        category: 'Anxiety',
        imageUrl: 'https://picsum.photos/seed/infographic3/600/400',
        duration: 4,
    },
     {
        id: 'info-4',
        title: 'Box Breathing',
        description: 'A simple and powerful technique to calm your nervous system.',
        type: 'infographic',
        category: 'Stress',
        imageUrl: 'https://picsum.photos/seed/infographic4/600/400',
        duration: 2,
    },
];

export default function LibraryPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
                <h1 className="flex items-center gap-2 text-xl font-semibold">
                    <BookHeart className="w-6 h-6" />
                    Mental Health Library
                </h1>
            </header>
            <main className="flex-1 p-4 space-y-6 bg-muted/40 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to Your Wellness Library</CardTitle>
                        <CardDescription>
                            Explore a curated collection of resources designed to support your mental health journey.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="infographics" className="w-full">
                            <TabsList className="grid w-full grid-cols-5 mb-4">
                                <TabsTrigger value="infographics"><Info className="w-4 h-4 mr-2" /> Infographics</TabsTrigger>
                                <TabsTrigger value="videos" disabled><Video className="w-4 h-4 mr-2" /> Videos</TabsTrigger>
                                <TabsTrigger value="podcasts" disabled><Mic className="w-4 h-4 mr-2" /> Podcasts</TabsTrigger>
                                <TabsTrigger value="courses" disabled><BookOpen className="w-4 h-4 mr-2" /> Courses</TabsTrigger>
                                <TabsTrigger value="talks" disabled><Users className="w-4 h-4 mr-2" /> Talks</TabsTrigger>
                            </TabsList>
                            <TabsContent value="infographics">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {mockResources.filter(r => r.type === 'infographic').map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
