
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Resource } from '@/lib/types';
import { Clock, Info, Video } from 'lucide-react';
import { Button } from '../ui/button';

type ResourceCardProps = {
  resource: Resource;
};

const typeIcons = {
    infographic: Info,
    video: Video,
    article: Info,
    podcast: Info
}


export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = typeIcons[resource.type];
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-video">
          <Image
            src={resource.imageUrl}
            alt={resource.title}
            fill
            className="object-cover"
          />
           <div className="absolute top-2 right-2">
            <Badge variant="secondary" className='capitalize'>
                <Icon className='w-3 h-3 mr-1'/>
                {resource.type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Badge className='mb-2'>{resource.category}</Badge>
        <h3 className="font-semibold line-clamp-2">{resource.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
          {resource.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-muted-foreground">
        {resource.duration && (
            <div className='flex items-center gap-1'>
                <Clock className="w-3 h-3" />
                <span>{resource.duration} min read</span>
            </div>
        )}
        <Button size="sm" variant="secondary" className="ml-auto">
            View
        </Button>
      </CardFooter>
    </Card>
  );
}
