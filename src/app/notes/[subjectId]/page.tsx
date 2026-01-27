'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { subjects } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Note = {
    id: string;
    title: string;
    subject: string;
    url: string;
};


export default function SubjectNotesPage() {
    const params = useParams();
    const subjectId = params.subjectId as string;
    const firestore = useFirestore();

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
                {!isLoading && notes?.map((note) => (
                    <Card key={note.id}>
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <BookOpen className="w-8 h-8 text-primary" />
                                <CardTitle>{note.title}</CardTitle>
                             </div>
                        </CardHeader>
                        <CardContent>
                             <Badge variant="secondary" className="mb-4">{note.subject}</Badge>
                             <p className="text-muted-foreground mb-4">Click to view the study material.</p>
                            <Button asChild>
                                <Link href={note.url} target="_blank">
                                    View Note <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                 {!isLoading && notes?.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">
                        No notes available for this subject yet.
                    </div>
                 )}
            </div>
        </div>
    );
}
