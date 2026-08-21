'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StudyMaterial } from '@/lib/types';
import { subjects } from '@/lib/data';

const extractNumber = (title: string): number => {
  const match = title.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
};

// YouTube aur Google Drive dono ke embeds handle karne ke liye smart function
function getEmbedUrl(url: string): string {
  if (!url) return '';

  // Google Drive Links
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }
  const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch && docMatch[1]) {
    return `https://docs.google.com/document/d/${docMatch[1]}/preview`;
  }

  // YouTube Normal Links (watch?v=ID)
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return url;
}

interface PublicContentListProps {
  contentType: StudyMaterial['contentType'];
  pageTitle: string;
}

export default function PublicContentList({ contentType, pageTitle }: PublicContentListProps) {
  const params = useParams();
  const subjectParam = (params.subjectId || params.subject) as string;
  const firestore = useFirestore();
  const [viewingUrl, setViewingUrl] = React.useState<string | null>(null);

  const currentSubject = subjects.find((s) => s.id === subjectParam);

  const materialsQuery = useMemoFirebase(() => {
    if (subjectParam) {
      return query(
        collection(firestore, 'study_materials'),
        where('contentType', '==', contentType),
        where('subject', '==', subjectParam),
        where('visible', '==', true)
      );
    }
    return query(
      collection(firestore, 'study_materials'),
      where('contentType', '==', contentType),
      where('visible', '==', true)
    );
  }, [firestore, contentType, subjectParam]);

  const { data: materials, isLoading, error } = useCollection<StudyMaterial>(materialsQuery);

  const sortedMaterials = React.useMemo(() => {
    if (!materials) return [];
    return [...materials].sort((a, b) => extractNumber(a.title) - extractNumber(b.title));
  }, [materials]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          {currentSubject ? `${currentSubject.name} ${pageTitle}` : pageTitle}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Browse {pageTitle} {currentSubject ? `for ${currentSubject.name}` : ''}.
        </p>
      </div>

      {isLoading && <p className="text-center">Loading materials...</p>}
      {error && <p className="text-center text-destructive">Could not load content.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!isLoading &&
          sortedMaterials.map((item) => {
            const embedUrl = getEmbedUrl(item.url);
            return (
              <Card key={item.id} className="animated-card">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-4">
                    {item.subject}
                  </Badge>
                  <p className="text-muted-foreground mb-4">Click to view material inside app.</p>
                  <Button onClick={() => setViewingUrl(embedUrl)}>
                    View Material <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}

        {!isLoading && sortedMaterials.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No content available for this section yet.
          </div>
        )}
      </div>

      <Dialog open={!!viewingUrl} onOpenChange={(isOpen) => !isOpen && setViewingUrl(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-2 sm:p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Viewer</DialogTitle>
          </DialogHeader>
          {viewingUrl && (
            <div className="flex-grow w-full h-full -mx-2 -mb-2 sm:mx-0 sm:mb-0">
              <iframe
                src={viewingUrl}
                className="w-full h-full border-0 rounded-b-lg"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
