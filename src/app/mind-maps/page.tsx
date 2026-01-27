'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

type MindMap = {
    id: string;
    title: string;
    subject: string;
    url: string;
};

/**
 * Converts a Google Drive sharing URL to a direct image content link.
 * @param url The original Google Drive sharing URL.
 * @returns A direct URL to the image content.
 */
function getGoogleDriveImageUrl(url: string): string {
    const fileIdRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const fileMatch = url.match(fileIdRegex);
    if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
    }
    // If it's not a recognizable Google Drive link, return it as is.
    // This allows using direct image URLs as well.
    return url;
}


export default function MindMapsPage() {
  const firestore = useFirestore();
  const [viewingMap, setViewingMap] = React.useState<MindMap | null>(null);

  const mindMapsQuery = useMemoFirebase(() => {
    return query(
        collection(firestore, 'study_materials'),
        where('contentType', '==', 'mindmap'),
        where('visible', '==', true)
    );
  }, [firestore]);

  const { data: mindMaps, isLoading, error } = useCollection<MindMap>(mindMapsQuery);

  const getDialogImageUrl = () => {
    if (!viewingMap) return '';
    return getGoogleDriveImageUrl(viewingMap.url);
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Workspace / Mind Maps
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Visualize complex topics and enhance your learning with our curated mind maps.
        </p>
      </div>

      {isLoading && <p className="text-center">Loading mind maps...</p>}
      {error && <p className="text-center text-destructive">Could not load mind maps.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {!isLoading && mindMaps?.map((map) => {
            const imageUrl = getGoogleDriveImageUrl(map.url);
            return (
            <Card key={map.id} className="overflow-hidden group flex flex-col">
                <CardHeader className="p-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={map.title}
                        width="600"
                        height="400"
                        className="w-full aspect-video object-cover"
                    />
                </CardHeader>
                <CardContent className="p-6 flex flex-col flex-grow">
                    <Badge variant="secondary" className="mb-2 w-fit">{map.subject}</Badge>
                    <CardTitle className="text-xl font-headline mb-auto">{map.title}</CardTitle>
                    <Button onClick={() => setViewingMap(map)} className="mt-4 w-fit">View Full Size</Button>
                </CardContent>
            </Card>
        )})}
         {!isLoading && mindMaps?.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
                No mind maps available yet.
            </div>
        )}
      </div>

      <Dialog open={!!viewingMap} onOpenChange={(isOpen) => !isOpen && setViewingMap(null)}>
        <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col p-2 sm:p-6">
          <DialogHeader>
            <DialogTitle>{viewingMap?.title}</DialogTitle>
          </DialogHeader>
          {viewingMap && (
            <div className="relative flex-grow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getDialogImageUrl()}
                alt={viewingMap.title || 'Mind Map'}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
