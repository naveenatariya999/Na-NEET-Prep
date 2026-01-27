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
import { ArrowRight, BrainCircuit } from 'lucide-react';

type MindMap = {
    id: string;
    title: string;
    subject: string;
    url: string;
};

/**
 * Converts a Google Drive sharing URL to a clean, embeddable preview URL.
 * @param url The original Google Drive URL.
 * @returns The embeddable preview URL.
 */
function getGoogleDriveEmbedUrl(url: string): string {
    const fileIdRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const fileMatch = url.match(fileIdRegex);
    if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
    }
    // If it's not a recognizable Google Drive link, return it as is.
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
        {!isLoading && mindMaps?.map((map) => (
            <Card key={map.id}>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <BrainCircuit className="w-8 h-8 text-primary" />
                        <CardTitle>{map.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Badge variant="secondary" className="mb-4">{map.subject}</Badge>
                    <p className="text-muted-foreground mb-4">Click to view the mind map.</p>
                    <Button onClick={() => setViewingMap(map)}>
                        View Mind Map <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        ))}
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
            <div className="flex-grow w-full h-full -mx-2 -mb-2 sm:mx-0 sm:mb-0">
                <iframe
                    src={getGoogleDriveEmbedUrl(viewingMap.url)}
                    className="w-full h-full border-0 rounded-b-lg"
                />
           </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
