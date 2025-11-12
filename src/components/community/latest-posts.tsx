
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockForumPosts, mockForums } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, PlusCircle } from "lucide-react";
import { Badge } from "../ui/badge";

export function LatestPosts() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Latest Posts</CardTitle>
                    <CardDescription>Recent discussions from the community.</CardDescription>
                </div>
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" /> Start a Discussion
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {mockForumPosts.map(post => {
                    const forum = mockForums.find(f => f.id === post.forumId);
                    return (
                        <div key={post.id} className="flex items-start gap-4 p-4 transition-colors border rounded-lg hover:bg-accent/50">
                             <Avatar>
                                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>{post.author.name}</span>
                                        <span>&middot;</span>
                                        <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
                                    </div>
                                    {forum && <Badge variant="secondary">{forum.name}</Badge>}
                                </div>
                                <h4 className="font-semibold text-lg hover:underline cursor-pointer">{post.title}</h4>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{post.replies} replies</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
