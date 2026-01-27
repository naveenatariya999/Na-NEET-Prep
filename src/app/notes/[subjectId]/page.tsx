'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { subjects } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Note = {
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
    
    // If it doesn't look like a known Google Drive link, return it as is.
    return newUrl;
}


export default function SubjectNotesPage() {
    const params = useParams();
    const subjectId = params.subjectId as string;
    const firestore = useFirestore();
    const [viewingUrl, setViewingUrl] = React.useState<string | null>(null);

    const subject = subjects.find(s => s.id === subjectId);

    const notesQuery = useMemoFirebase(() => {
        if (!subjectId) return null;
        return query(
            collection(firestore, 'study_materials'),
            where('contentType', '==', 'notes'),
            where('subject', '==', subjectId),
            where('visible', '==', true)
        );
    }, [firestore, subjectId]);
    
    const { data: notes, isLoading, error } = useCollection<Note>(notesQuery);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
                    {subject?.name} Notes
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Browse the study notes for {subject?.name}.
                </p>
            </div>
            
            {isLoading && <p className="text-center">Loading notes...</p>}
            {error && <p className="text-center text-destructive">Could not load notes.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!isLoading && notes?.map((note) => {
                    const embedUrl = getGoogleDriveEmbedUrl(note.url);
                    return (
                    <Card key={note.id} className="animated-card">
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <BookOpen className="w-8 h-8 text-primary" />
                                <CardTitle>{note.title}</CardTitle>
                             </div>
                        </CardHeader>
                        <CardContent>
                             <Badge variant="secondary" className="mb-4">{note.subject}</Badge>
                             <p className="text-muted-foreground mb-4">Click to view the study material.</p>
                            <Button onClick={() => setViewingUrl(embedUrl)}>
                                View Note <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )})}
                 {!isLoading && notes?.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">
                        No notes available for this subject yet.
                    </div>
                 )}
            </div>

            <Dialog open={!!viewingUrl} onOpenChange={(isOpen) => !isOpen && setViewingUrl(null)}>
                <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-2 sm:p-6">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle>Note Viewer</DialogTitle>
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
