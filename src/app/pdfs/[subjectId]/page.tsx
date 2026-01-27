'use client';

import { useParams } from 'next/navigation';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subjects } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Pdf = {
    id: string;
    title: string;
    subject: string;
    url: string;
};


export default function SubjectPdfsPage() {
    const params = useParams();
    const subjectId = params.subjectId as string;
    const firestore = useFirestore();

    const subject = subjects.find(s => s.id === subjectId);

    const pdfsQuery = useMemoFirebase(() => {
        if (!subjectId) return null;
        return query(
            collection(firestore, 'study_materials'),
            where('contentType', '==', 'pdf'),
            where('subject', '==', subjectId),
            where('visible', '==', true)
        );
    }, [firestore, subjectId]);
    
    const { data: pdfs, isLoading, error } = useCollection<Pdf>(pdfsQuery);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
                    {subject?.name} PDFs
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Browse the PDF materials for {subject?.name}.
                </p>
            </div>
            
            {isLoading && <p className="text-center">Loading PDFs...</p>}
            {error && <p className="text-center text-destructive">Could not load PDFs.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!isLoading && pdfs?.map((pdf) => (
                    <Card key={pdf.id}>
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <FileText className="w-8 h-8 text-primary" />
                                <CardTitle>{pdf.title}</CardTitle>
                             </div>
                        </CardHeader>
                        <CardContent>
                             <Badge variant="secondary" className="mb-4">{pdf.subject}</Badge>
                             <p className="text-muted-foreground mb-4">Click to view the PDF material.</p>
                            <Button asChild>
                                <Link href={pdf.url} target="_blank">
                                    View PDF <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                 {!isLoading && pdfs?.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">
                        No PDFs available for this subject yet.
                    </div>
                 )}
            </div>
        </div>
    );
}
