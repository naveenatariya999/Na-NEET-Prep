'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

type Pyq = {
  id: string;
  title: string;
  subject: string;
  url: string;
};

/**
 * Converts various Google Drive sharing URLs to a clean, embeddable preview URL.
 * @param url The original Google Drive URL.
 * @returns The embeddable preview URL.
 */
function getGoogleDriveEmbedUrl(url: string): string {
    let newUrl = url;

    // Google Drive file links: /file/d/FILE_ID/view -> /file/d/FILE_ID/preview
    const fileIdRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const fileMatch = url.match(fileIdRegex);
    if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
    }

    // Google Docs: /document/d/DOC_ID/edit -> /document/d/DOC_ID/preview
    const docIdRegex = /docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/;
    const docMatch = url.match(docIdRegex);
    if (docMatch && docMatch[1]) {
        return `https://docs.google.com/document/d/${docMatch[1]}/preview`;
    }
    
    return newUrl;
}

export default function PYQsPage() {
  const firestore = useFirestore();
  const [viewingUrl, setViewingUrl] = React.useState<string | null>(null);

  const pyqsQuery = useMemoFirebase(() => {
    return query(
        collection(firestore, 'study_materials'),
        where('contentType', '==', 'pyq'),
        where('visible', '==', true)
    );
  }, [firestore]);

  const { data: pyqs, isLoading, error } = useCollection<Pyq>(pyqsQuery);


  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Previous Year Questions (PYQs)
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Practice with NEET PYQs organized year-wise and chapter-wise with original explanations.
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Loading PYQs...</TableCell>
              </TableRow>
            )}
            {error && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-destructive">Could not load PYQs.</TableCell>
                </TableRow>
            )}
            {!isLoading && pyqs?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center">No PYQs available yet.</TableCell>
                </TableRow>
            )}
            {pyqs?.map((pyq) => {
              const embedUrl = getGoogleDriveEmbedUrl(pyq.url);
              return (
              <TableRow key={pyq.id}>
                <TableCell className="font-medium">{pyq.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{pyq.subject}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => setViewingUrl(embedUrl)} variant="outline" size="sm">
                    View Questions
                  </Button>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>

       <Dialog open={!!viewingUrl} onOpenChange={(isOpen) => !isOpen && setViewingUrl(null)}>
            <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-2 sm:p-6">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>PYQ Viewer</DialogTitle>
                </DialogHeader>
                {viewingUrl && (
                     <div className="flex-grow w-full h-full -mx-2 -mb-2 sm:mx-0 sm:mb-0">
                         <iframe src={viewingUrl} className="w-full h-full border-0 rounded-b-lg" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    </div>
  );
}
