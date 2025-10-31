
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookHeart, Info, Video, Mic, BookOpen, Users, Brain, Book } from 'lucide-react';
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
        contentUrl: 'https://www.google.com/search?q=understanding+anxiety+infographic',
        duration: 5,
    },
    {
        id: 'info-2',
        title: 'The CBT Triangle',
        description: 'Learn how thoughts, feelings, and behaviors are connected.',
        type: 'infographic',
        category: 'CBT',
        imageUrl: 'https://picsum.photos/seed/infographic2/600/400',
        contentUrl: 'https://www.google.com/search?q=cbt+triangle+infographic',
        duration: 3,
    },
    {
        id: 'info-3',
        title: '5 Grounding Techniques',
        description: 'Simple exercises to stay present during moments of panic.',
        type: 'infographic',
        category: 'Anxiety',
        imageUrl: 'https://picsum.photos/seed/infographic3/600/400',
        contentUrl: 'https://www.google.com/search?q=grounding+techniques+infographic',
        duration: 4,
    },
     {
        id: 'info-4',
        title: 'Box Breathing',
        description: 'A simple and powerful technique to calm your nervous system.',
        type: 'infographic',
        category: 'Stress',
        imageUrl: 'https://picsum.photos/seed/infographic4/600/400',
        contentUrl: 'https://www.google.com/search?q=box+breathing+infographic',
        duration: 2,
    },
    {
        id: 'video-1',
        title: 'How Mindfulness Empowers Us',
        description: 'An animated introduction to the power of being present.',
        type: 'video',
        category: 'Mindfulness',
        imageUrl: 'https://picsum.photos/seed/video1/600/400',
        contentUrl: 'https://www.youtube.com/watch?v=w6T02g5hnT4',
        duration: 10,
    },
    {
        id: 'video-2',
        title: 'The Science of Kindness',
        description: 'Discover the psychological benefits of being kind to others and yourself.',
        type: 'video',
        category: 'Well-being',
        imageUrl: 'https://picsum.photos/seed/video2/600/400',
        contentUrl: 'https://www.youtube.com/watch?v=O9zA2iI6C0A',
        duration: 8,
    },
    {
        id: 'podcast-1',
        title: 'The Happiness Lab',
        description: 'Dr. Laurie Santos on the science of happiness.',
        type: 'podcast',
        category: 'Positive Psychology',
        imageUrl: 'https://picsum.photos/seed/podcast1/600/400',
        contentUrl: 'https://www.pushkin.fm/podcasts/the-happiness-lab-with-dr-laurie-santos',
        duration: 35,
    },
    {
        id: 'podcast-2',
        title: 'Feeling Good Podcast',
        description: 'Dr. David Burns discusses CBT techniques for overcoming depression and anxiety.',
        type: 'podcast',
        category: 'CBT',
        imageUrl: 'https://picsum.photos/seed/podcast2/600/400',
        contentUrl: 'https://feelinggood.com/podcast/',
        duration: 45,
    },
    {
        id: 'course-1',
        title: 'Foundations of Positive Psychology',
        description: 'A 5-part micro-course on the core principles of flourishing.',
        type: 'course',
        category: 'Positive Psychology',
        imageUrl: 'https://picsum.photos/seed/course1/600/400',
        contentUrl: 'https://www.coursera.org/learn/positive-psychology',
        duration: 60,
    },
    {
        id: 'talk-1',
        title: 'The Power of Vulnerability',
        description: "Brené Brown's groundbreaking talk on human connection.",
        type: 'talk',
        category: 'Relationships',
        imageUrl: 'https://picsum.photos/seed/talk1/600/400',
        contentUrl: 'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability',
        duration: 20,
    },
    {
        id: 'book-1',
        title: 'Atomic Habits',
        description: "Summary of James Clear's framework for building good habits.",
        type: 'book',
        category: 'Productivity',
        imageUrl: 'https://picsum.photos/seed/book1/600/400',
        contentUrl: 'https://www.google.com/search?q=atomic+habits+summary',
        duration: 15,
    },
     {
        id: 'research-1',
        title: 'The Benefits of Nature on Mental Health',
        description: 'A summary of recent studies on ecotherapy.',
        type: 'research',
        category: 'Well-being',
        imageUrl: 'https://picsum.photos/seed/research1/600/400',
        contentUrl: 'https://www.google.com/search?q=benefits+of+nature+on+mental+health+research',
        duration: 12,
    },
];

export default function LibraryPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 hidden h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 md:flex md:items-center">
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
                            <TabsList className="grid w-full h-auto grid-cols-2 p-2 mb-4 sm:grid-cols-4 lg:grid-cols-7">
                                <TabsTrigger value="infographics"><Info className="w-4 h-4 mr-2" /> Infographics</TabsTrigger>
                                <TabsTrigger value="videos"><Video className="w-4 h-4 mr-2" /> Videos</TabsTrigger>
                                <TabsTrigger value="podcasts"><Mic className="w-4 h-4 mr-2" /> Podcasts</TabsTrigger>
                                <TabsTrigger value="courses"><BookOpen className="w-4 h-4 mr-2" /> Courses</TabsTrigger>
                                <TabsTrigger value="talks"><Users className="w-4 h-4 mr-2" /> Talks</TabsTrigger>
                                <TabsTrigger value="books"><Book className="w-4 h-4 mr-2" /> Books</TabsTrigger>
                                <TabsTrigger value="research"><Brain className="w-4 h-4 mr-2" /> Research</TabsTrigger>
                            </TabsList>
                            <TabsContent value="infographics">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {mockResources.filter(r => r.type === 'infographic').map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="videos">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {mockResources.filter(r => r.type === 'video').map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="podcasts">
                                <div className="grid gap-4 md-grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {mockResources.filter(r => r.type === 'podcast').map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </TabsContent>
                             <TabsContent value="courses">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {mockResources.filter(r => r.type === 'course').map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </TabsContent>
                             <TabsContent value="talks">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {mockResources.filter(r => r.type === 'talk').map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="books">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {mockResources.filter(r => r.type === 'book').map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="research">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {mockResources.filter(r => r.type === 'research').map((resource) => (
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
