'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';

type Pyq = {
  id: string;
  title: string;
  subject: string;
  url: string;
};

export default function PYQsPage() {
  const firestore = useFirestore();

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
            {pyqs?.map((pyq) => (
              <TableRow key={pyq.id}>
                <TableCell className="font-medium">{pyq.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{pyq.subject}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={pyq.url} target="_blank">View Questions</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
